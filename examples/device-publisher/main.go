package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
)

func main() {

	url := os.Getenv("NATS_URL")
	if url == "" {
		url = nats.DefaultURL
	}

	nc, _ := nats.Connect(url)
	defer nc.Drain()

	js, _ := jetstream.New(nc)

	cfg := jetstream.StreamConfig{
		Name:      "HEALTH",
		Retention: jetstream.WorkQueuePolicy,
		Subjects:  []string{"health.>"},
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	stream, _ := js.CreateStream(ctx, cfg)
	fmt.Println("created the stream")

	js.Publish(ctx, "health.data.stream.us.nurse-actions", []byte("{'action': 'check_vitals'}"))
	js.Publish(ctx, "health.data.stream.eu.neuro", []byte("{'ekg': '0x2579'}"))
	js.Publish(ctx, "health.data.stream.us.vitals", []byte("{'bp': '120/80'}"))
	fmt.Println("published 3 messages")

	fmt.Println("# Stream info without any consumers")
	printStreamState(ctx, stream)

	cons, _ := stream.CreateOrUpdateConsumer(ctx, jetstream.ConsumerConfig{
		Name: "processor-1",
	})

	msgs, _ := cons.Fetch(3)
	for msg := range msgs.Messages() {
		msg.DoubleAck(ctx)
	}

	fmt.Println("\n# Stream info with one consumer")
	printStreamState(ctx, stream)

	_, err := stream.CreateOrUpdateConsumer(ctx, jetstream.ConsumerConfig{
		Name: "processor-2",
	})
	fmt.Println("\n# Create an overlapping consumer")
	fmt.Println(err)

	stream.DeleteConsumer(ctx, "processor-1")

	_, err = stream.CreateOrUpdateConsumer(ctx, jetstream.ConsumerConfig{
		Name: "processor-2",
	})
	fmt.Printf("created the new consumer? %v\n", err == nil)
	stream.DeleteConsumer(ctx, "processor-2")

	fmt.Println("\n# Create non-overlapping consumers")
	cons1, _ := stream.CreateOrUpdateConsumer(ctx, jetstream.ConsumerConfig{
		Name:          "processor-us",
		FilterSubject: "health.data.stream.us.>",
	})
	cons2, _ := stream.CreateOrUpdateConsumer(ctx, jetstream.ConsumerConfig{
		Name:          "processor-eu",
		FilterSubject: "health.data.stream.eu.>",
	})

	js.Publish(ctx, "health.data.stream.us.nurse-actions", []byte("{'action': 'check_vitals'}"))
	js.Publish(ctx, "health.data.stream.eu.neuro", []byte("{'ekg': '0x2579'}"))
	js.Publish(ctx, "health.data.stream.us.vitals", []byte("{'bp': '120/80'}"))
	fmt.Println("published 4 messages")

	msgs, _ = cons1.Fetch(2)
	for msg := range msgs.Messages() {
		fmt.Printf("us sub got: %s\n", msg.Subject())
		msg.Ack()
	}

	msgs, _ = cons2.Fetch(2)
	for msg := range msgs.Messages() {
		fmt.Printf("eu sub got: %s\n", msg.Subject())
		msg.Ack()
	}
}

func printStreamState(ctx context.Context, stream jetstream.Stream) {
	info, _ := stream.Info(ctx)
	b, _ := json.MarshalIndent(info.State, "", " ")
	fmt.Println(string(b))
}
