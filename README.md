# Edge AI for Healthcare
***Experimental and Research Use only***

## Platform Design
```mermaid
flowchart
subgraph Healthcare Edge Computing Network
    S[Patient Monitoring Device 1] -->|Real-time Data| Z
    T[Patient Monitoring Device 2] -->|Real-time Data| Z
    Y[Remote Diagnostic Device N] -->|Real-time Data| Z
    subgraph Edge Processing Hub
        subgraph Secure Data Gateway
            Z@{ shape: das, label: "health.data.stream" }
            U@{ shape: lin-cyl, label: "HIPAA-Compliant Storage" }
        end
        Z -->|Process| A{AI Inference Router}
        E[(Patient Health DB)]
        R[(De-identified Research DB)]
        A --> |Store w/ retention policy| E
        E --> |De-identify & Transform| R
        R --> |Secure Transfer| Q[Research Repository]
    end
    subgraph AI Models
        A <-->|Anomaly Detection| M[Vital Signs Analysis]
        A <-->|Image Processing| I[Diagnostic Imaging]
        A <-->|Event Prediction| P[Patient Risk Assessment]
    end
    subgraph API Access Control Layer
        F[Authentication Service] 
        G[Authorization Service]
        B[Rate Limiting]
        K[Audit Logging]
    end
    
    subgraph Healthcare Providers
        F & G -->|TLS 1.3| H[Clinical Dashboard]
        F & G -->|TLS 1.3| C[Emergency Response]
        F & G -->|TLS 1.3| D[Doctor's Mobile App]
    end
    
    E -->|Protected Data| F
    A -->|Controlled Access| G
    
    subgraph Research Access
        Q --> |Aggregate Analytics| V[Population Health Studies]
        Q --> |Anonymized Data| W[Clinical Research]
        Q --> |Model Training| X[AI Model Development]
    end
end
```

## Implementation

Incremental R&D approach:

1. Hands on device to start MQTT transmission to jetstream
2. NVIDIA Spark as Edge AI processor - allows performant models at the edge with Memory Bandwidth and GPU acceleration
3. Map DB Schema
4. Define API Security Access & Control for downstream health providers

## Directory Structure

```sh
├── config
│   ├── mqtt.conf # Example MQTT configuration for Secure Edge Messaging
├── examples
│   ├── device-publisher # Example Stream Worker Queue Logic that can compile to a Golang binary
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── main.go
├── docs
│   ├── edgeai-icp-mil-tech-si.md # Edge AI Inter Cranial Pressure Monitoring System Technical Strategy
│   └── icp-proposal-arch.md # Edge AI Inter Cranial Pressure Monitoring System Proposal Architecture
└── README.md
```