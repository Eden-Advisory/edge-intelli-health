# Edge AI for Healthcare
***Experimental and Research Use only***

## Mindmap
```mermaid
mindmap
root((Grant Opportunities for Medical Device Innovations))
    ARPA-H
      Health Science Futures
        Continuous Biometric Monitoring
        Advanced Medical Imaging

      Scalable Solutions
        Point-of-Care Diagnostics
        Smart Drug Delivery Systems

      Proactive Health
        Continuous Biometric Monitoring
        Smart Drug Delivery Systems

      Resilient Systems
        Surgical Guidance Systems

    MTEC 
      Combat Casualty Care
        Smart Drug Delivery Systems
        Continuous Biometric Monitoring

      Infection Prevention
        Ingestible/Implantable Sensors
        Point-of-Care Diagnostics
      Military-Civilian Dual Use
        Surgical Guidance Systems
        Rehabilitation & Assistive Tech

    NSF
      Smart Health Technologies
        Continuous Biometric Monitoring
        Advanced Medical Imaging
      Sustainable Devices
        Point-of-Care Diagnostics
        Rehabilitation & Assistive Tech
      Training & Workforce Development
        Rehabilitation & Assistive Tech
    NIH
      Translational MedTech (Blueprint MedTech)
        Continuous Biometric Monitoring
        Ingestible/Implantable Sensors

      Health Equity Focus Areas 
        Point-of-Care Diagnostics 
        Advanced Medical Imaging 

      Neurological Disorders (Neurotech)
        Smart Drug Delivery Systems 
        Rehabilitation & Assistive Tech 
```

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

## Sequence Diagram: Healthcare Edge Computing Network Data Flow

```mermaid
sequenceDiagram
    participant PMD as Patient Monitoring Devices
    participant RDD as Remote Diagnostic Devices
    participant HDS as health.data.stream
    participant AIR as AI Inference Router
    participant AIM as AI Models
    participant PHD as Patient Health DB
    participant RDB as De-identified Research DB
    participant RR as Research Repository
    participant ACL as API Access Control Layer
    participant HP as Healthcare Providers
    participant RA as Research Access

    PMD ->> HDS: Real-time patient data
    RDD ->> HDS: Real-time diagnostic data
    
    HDS ->> AIR: Process incoming data
    
    AIR ->> AIM: Route data to appropriate AI models
    AIM -->> AIR: Return analysis results
    
    AIR ->> PHD: Store data with retention policy
    
    PHD ->> RDB: De-identify & transform data
    RDB ->> RR: Secure transfer of anonymized data
    
    PHD ->> ACL: Provide protected data
    AIR ->> ACL: Provide controlled access
    
    ACL ->> HP: Authenticate & authorize access (TLS 1.3)
    HP -->> ACL: Request patient data/analysis
    ACL -->> HP: Return authorized data
    
    RR ->> RA: Provide anonymized data for research
    RA -->> RR: Request research datasets
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