// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetId = button.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // If switching to architecture tab, initialize/render mermaid
            if (targetId === 'architecture-panel' || targetId === 'data-flow-panel') {
                mermaid.init(undefined, document.querySelectorAll('.mermaid'));
                
                // Reset zoom for diagrams if switching to those tabs
                if (targetId === 'data-flow-panel') {
                    currentZoom = 1;
                    updateZoom('sequence-diagram-wrapper');
                }
                if (targetId === 'architecture-panel') {
                    architectureZoom = 1;
                    updateArchitectureZoom();
                }
            }
        });
    });
    
    // Add attribution in console
    console.log('EdgeAI Point of Care Data Platform by Eden Advisory and DesignPlex');
    console.log('© 2025 Eden Advisory × DesignPlex - All Rights Reserved');
    
    // Make sure body takes full height to push footer to bottom
    document.body.style.minHeight = '100vh';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    
    // Ensure footer stays at bottom
    const footer = document.querySelector('footer');
    const tabContent = document.querySelector('.tab-content');
    
    // Update heights when window resizes
    function updateLayout() {
        const headerHeight = document.querySelector('header').offsetHeight;
        const tabNavHeight = document.querySelector('.tab-navigation').offsetHeight;
        const footerHeight = footer.offsetHeight;
        const availableHeight = window.innerHeight - headerHeight - tabNavHeight - footerHeight;
        tabContent.style.height = `${availableHeight}px`;
    }
    
    // Initial layout update
    updateLayout();
    
    // Update on window resize
    window.addEventListener('resize', updateLayout);
    
    // Initialize Knowledge Graph
    initializeKnowledgeGraph();
    
    // Initialize mermaid for diagrams
    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        flowchart: {
            htmlLabels: true,
            curve: 'basis'
        },
        sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: false,
            bottomMarginAdj: 10,
            useMaxWidth: true
        },
        themeVariables: {
            primaryColor: '#7000ff',
            primaryTextColor: '#e0e7ff',
            primaryBorderColor: '#7000ff',
            lineColor: '#7000ff',
            secondaryColor: '#ff00aa',
            tertiaryColor: '#12171f',
            // Sequence diagram specific
            sequenceNumberColor: '#e0e7ff',
            actorBorder: '#ff00aa',
            actorBkg: '#192231',
            actorTextColor: '#e0e7ff',
            actorLineColor: '#ff00aa',
            signalColor: '#e0e7ff',
            signalTextColor: '#e0e7ff',
            labelBoxBorderColor: '#ff00aa',
            labelBoxBkgColor: '#192231',
            labelTextColor: '#e0e7ff',
            loopTextColor: '#e0e7ff',
            noteBorderColor: '#ff00aa',
            noteBkgColor: '#192231',
            noteTextColor: '#e0e7ff',
            activationBorderColor: '#ff00aa',
            activationBkgColor: '#192231',
            sequenceDiagram: {
                actorFontFamily: "'Segoe UI', 'Roboto', sans-serif",
                actorFontSize: 14,
                actorFontWeight: 'bold',
                noteFontFamily: "'Segoe UI', 'Roboto', sans-serif",
                noteFontSize: 14,
                messageFontFamily: "'Segoe UI', 'Roboto', sans-serif",
                messageFontSize: 14
            }
        }
    });
    
    // Add zoom functionality for the sequence diagram
    let currentZoom = 1;
    document.getElementById('zoom-in').addEventListener('click', function() {
        currentZoom += 0.1;
        updateZoom('sequence-diagram-wrapper');
    });
    
    document.getElementById('zoom-out').addEventListener('click', function() {
        currentZoom = Math.max(0.5, currentZoom - 0.1);
        updateZoom('sequence-diagram-wrapper');
    });
    
    document.getElementById('zoom-reset').addEventListener('click', function() {
        currentZoom = 1;
        updateZoom('sequence-diagram-wrapper');
    });
    
    // Add zoom functionality for the architecture diagram
    let architectureZoom = 1;
    document.getElementById('architecture-zoom-in').addEventListener('click', function() {
        architectureZoom += 0.1;
        updateArchitectureZoom();
    });
    
    document.getElementById('architecture-zoom-out').addEventListener('click', function() {
        architectureZoom = Math.max(0.5, architectureZoom - 0.1);
        updateArchitectureZoom();
    });
    
    document.getElementById('architecture-zoom-reset').addEventListener('click', function() {
        architectureZoom = 1;
        updateArchitectureZoom();
    });
    
    function updateZoom(wrapperId) {
        const wrapper = document.getElementById(wrapperId);
        const diagram = wrapper.querySelector('.mermaid');
        diagram.style.transform = `scale(${currentZoom})`;
        diagram.style.transformOrigin = 'top center';
    }
    
    function updateArchitectureZoom() {
        const wrapper = document.getElementById('architecture-diagram-wrapper');
        const diagram = wrapper.querySelector('.mermaid');
        diagram.style.transform = `scale(${architectureZoom})`;
        diagram.style.transformOrigin = 'top center';
    }
});

// Knowledge Graph Functionality
function initializeKnowledgeGraph() {
    // Define cluster names
    const clusterNames = {
        "Cluster A": { name: "Wearable Monitoring", color: "#FF5733", id: "cluster-a" },
        "Cluster B": { name: "Portable Imaging", color: "#33FF57", id: "cluster-b" },
        "Cluster C": { name: "Adaptive Therapeutics", color: "#3357FF", id: "cluster-c" },
        "Cluster D": { name: "Point-of-Care Diagnostics", color: "#F033FF", id: "cluster-d" },
        "Cluster E": { name: "Surgical Assistance", color: "#FF33F0", id: "cluster-e" },
        "Cluster F": { name: "Rehabilitation Systems", color: "#FFBD33", id: "cluster-f" },
        "Cluster G": { name: "Smart Implantables", color: "#33FFF0", id: "cluster-g" },
        "Cluster H": { name: "Neurological Assessment", color: "#BD33FF", id: "cluster-h" }
    };
    
    const data = {
        nodes: [],
        links: []
    };
    
    // Add cluster nodes
    Object.entries(clusterNames).forEach(([key, value]) => {
        data.nodes.push({
            id: value.id,
            name: value.name,
            type: "cluster",
            color: value.color,
            value: 20,
            description: `Platform technology for ${value.name.toLowerCase()} applications`,
            market: "Multi-billion dollar opportunity across multiple segments"
        });
    });
    
    // Use embedded data to avoid CORS issues with file:// URLs
    const ideaClusterData = {
        opportunities: [
            // All 50 opportunities from IdeaCluster.json
            {id: 1, clusterNames: ["Cluster B"], name: "Ultrasound Accessibility in Rural Settings", problem: "Inconsistent quality in ultrasound imaging in underserved areas", aiHardwareSolution: "AI-guided portable ultrasound with real-time feedback for non-specialists", TAM: "$9,320 M"},
            {id: 2, clusterNames: ["Cluster B"], name: "Diabetic Retinopathy Early Detection", problem: "Delayed diagnosis leading to preventable vision loss", aiHardwareSolution: "Compact, affordable retinal imaging with integrated AI for immediate screening", TAM: "$482 M"},
            {id: 3, clusterNames: ["Cluster D"], name: "Stroke Triage Optimization", problem: "Inefficient triage of stroke patients for appropriate interventions", aiHardwareSolution: "Portable EEG with AI analysis to differentiate stroke types before imaging", TAM: "$3,840 M"},
            {id: 4, clusterNames: ["Cluster A"], name: "Early Sepsis Detection", problem: "Delayed detection of sepsis in hospitalized patients", aiHardwareSolution: "Wearable multi-sensor with AI monitoring that integrates vitals and biomarkers", TAM: "$1,200 M"},
            {id: 5, clusterNames: ["Cluster A"], name: "Parkinson's Disease Progression Monitoring", problem: "Inconsistent monitoring of disease progression", aiHardwareSolution: "Wearable sensors with AI analysis quantifying motor symptoms in real-world", TAM: "$5,260 M"},
            {id: 6, clusterNames: ["Cluster A", "Cluster C"], name: "Epilepsy Management System", problem: "Difficult management of treatment-resistant epilepsy", aiHardwareSolution: "Wearable EEG with AI seizure prediction and automated medication delivery", TAM: "$750 M"},
            {id: 7, clusterNames: [], name: "Smart Medication Adherence System", problem: "Suboptimal adherence in patients with complex medication regimens", aiHardwareSolution: "Smart dispenser with cameras and sensors verifying correct medication intake", TAM: "$2,510 M"},
            {id: 8, clusterNames: [], name: "Advanced Wound Care Management", problem: "Inefficient wound care monitoring and treatment adjustment", aiHardwareSolution: "Smartphone attachment with sensors analyzing wound characteristics", TAM: "$413 M"},
            {id: 9, clusterNames: ["Cluster D"], name: "Remote Pulmonary Function Assessment", problem: "Limited access to pulmonary function testing", aiHardwareSolution: "Portable spirometer with AI providing clinical-grade assessment", TAM: "$1,100 M"},
            {id: 10, clusterNames: ["Cluster D"], name: "Home-Based Sleep Apnea Diagnosis", problem: "Delayed diagnosis of sleep apnea", aiHardwareSolution: "Non-invasive wearable sleep monitoring system with AI diagnostics", TAM: "$2,180 M"},
            {id: 11, clusterNames: ["Cluster E"], name: "Advanced Fetal Monitoring", problem: "Subjective assessment of fetal wellbeing during labor", aiHardwareSolution: "Fetal monitor with AI interpretation predicting distress with higher accuracy", TAM: "$3,760 M"},
            {id: 12, clusterNames: ["Cluster D"], name: "Smart Otoscope for Ear Infection Diagnosis", problem: "Misdiagnosis of pediatric ear infections", aiHardwareSolution: "Smartphone otoscope with AI distinguishing bacterial from viral causes", TAM: "$220 M"},
            {id: 13, clusterNames: ["Cluster A", "Cluster C"], name: "Heart Failure Monitoring Platform", problem: "Inefficient monitoring of heart failure patients", aiHardwareSolution: "Wearable patch combining multiple sensors to predict decompensation", TAM: "$10,000 M"},
            {id: 14, clusterNames: ["Cluster A"], name: "Postoperative Complication Detection", problem: "Delayed detection of postoperative complications", aiHardwareSolution: "Wearable system detecting early signs of infection or bleeding", TAM: "$9,900 M"},
            {id: 15, clusterNames: ["Cluster B"], name: "Portable Lung Assessment Tool", problem: "Limited accessibility of pulmonary imaging", aiHardwareSolution: "Portable ultrasound with AI interpretation comparable to chest X-ray", TAM: "$9,320 M"},
            {id: 16, clusterNames: [], name: "Dialysis Optimization System", problem: "Difficult management of dialysis adequacy", aiHardwareSolution: "Wearable bioimpedance device continuously monitoring fluid status", TAM: "$20,160 M"},
            {id: 17, clusterNames: ["Cluster A"], name: "Continuous Atrial Fibrillation Monitoring", problem: "Unreliable detection of atrial fibrillation", aiHardwareSolution: "Wearable ECG patch with AI accurately distinguishing arrhythmias", TAM: "$1,400 M"},
            {id: 18, clusterNames: ["Cluster H"], name: "Objective Concussion Assessment", problem: "Subjective assessment of concussion and recovery", aiHardwareSolution: "Portable device combining EEG, eye tracking with AI analysis", TAM: "$7,420 M"},
            {id: 19, clusterNames: ["Cluster B", "Cluster D"], name: "AI-Powered Dermatology Platform", problem: "Limited access to dermatology expertise", aiHardwareSolution: "Smartphone attachment with specialized cameras and AI diagnostics", TAM: "$9,500 M"},
            {id: 20, clusterNames: ["Cluster C"], name: "Intelligent CPAP System", problem: "Inefficient CPAP titration for sleep apnea", aiHardwareSolution: "Smart CPAP device adjusting settings based on real-time patterns", TAM: "$9,700 M"},
            {id: 21, clusterNames: ["Cluster D"], name: "Peripheral Artery Disease Early Detection", problem: "Delayed detection of peripheral artery disease", aiHardwareSolution: "Portable device with AI analyzing circulation before symptoms develop", TAM: "$426 M"},
            {id: 22, clusterNames: ["Cluster C"], name: "Predictive Glucose Management System", problem: "Challenging management of type 1 diabetes", aiHardwareSolution: "Closed-loop insulin delivery with AI predicting glucose trends", TAM: "$5,260 M"},
            {id: 23, clusterNames: ["Cluster D"], name: "Accessible Cardiac Stress Assessment", problem: "Limited access to cardiac stress testing", aiHardwareSolution: "Wearable system enabling supervised cardiac stress assessment", TAM: "$2,500 M"},
            {id: 24, clusterNames: ["Cluster A", "Cluster H"], name: "Alzheimer's Treatment Response Monitor", problem: "Difficult monitoring of medication effects in Alzheimer's disease", aiHardwareSolution: "Wearable continuously assessing cognitive function in real-world settings", TAM: "$5,200 M"},
            {id: 25, clusterNames: ["Cluster G"], name: "Inflammatory Bowel Disease Predictor", problem: "Unpredictable flares in inflammatory bowel disease", aiHardwareSolution: "Ingestible sensor with AI predicting disease flares before symptoms", TAM: "$700 M"},
            {id: 26, clusterNames: ["Cluster C"], name: "Precision Radiation Therapy Monitoring", problem: "Inefficient management of radiation therapy", aiHardwareSolution: "Wearable radiation sensors mapping delivery and tissue response", TAM: "$3,440 M"},
            {id: 27, clusterNames: ["Cluster A", "Cluster H"], name: "Psychiatric Medication Optimization", problem: "Difficult titration of psychiatric medications", aiHardwareSolution: "Wearable device tracking medication response and side effects", TAM: "$1,130 M"},
            {id: 28, clusterNames: ["Cluster D"], name: "Mobile Asthma Management Platform", problem: "Limited access to accurate spirometry in asthma", aiHardwareSolution: "Smartphone attachment with AI providing clinical-grade assessment", TAM: "$1,100 M"},
            {id: 29, clusterNames: ["Cluster B"], name: "Early Glaucoma Progression Detection", problem: "Delayed detection of glaucoma progression", aiHardwareSolution: "Portable device combining visual field testing and retinal imaging with AI", TAM: "$360 M"},
            {id: 30, clusterNames: ["Cluster A"], name: "Rheumatoid Arthritis Treatment Monitor", problem: "Unpredictable response to rheumatoid arthritis treatments", aiHardwareSolution: "Wearable device monitoring joint inflammation and predicting response", TAM: "$4,200 M"},
            {id: 31, clusterNames: ["Cluster F"], name: "AI-Guided Rehabilitation System", problem: "Limited real-time feedback in physical therapy", aiHardwareSolution: "Wearable sensors providing real-time feedback on exercise form", TAM: "$16,960 M"},
            {id: 32, clusterNames: ["Cluster B", "Cluster E"], name: "Predictive Vein Access System", problem: "Difficult intravenous access in patients with poor veins", aiHardwareSolution: "Vein visualization with AI predicting most successful access points", TAM: "$225 M"},
            {id: 33, clusterNames: ["Cluster E", "Cluster G"], name: "Anastomotic Leak Early Detection", problem: "Delayed detection of anastomotic leaks after surgery", aiHardwareSolution: "Ingestible sensor detecting biochemical changes before symptoms", TAM: "$700 M"},
            {id: 34, clusterNames: ["Cluster E"], name: "Adaptive Spinal Navigation System", problem: "Limited precision in spinal navigation during surgery", aiHardwareSolution: "Surgical navigation with AI providing real-time guidance during surgery", TAM: "$1,800 M"},
            {id: 35, clusterNames: ["Cluster C"], name: "Personalized Neuromodulation for Pain", problem: "Difficult management of chronic pain", aiHardwareSolution: "Wearable neuromodulation with AI learning individual pain patterns", TAM: "$7,400 M"},
            {id: 36, clusterNames: ["Cluster B", "Cluster D"], name: "Non-Invasive Melanoma Analyzer", problem: "Unreliable detection of melanoma in primary care", aiHardwareSolution: "Handheld device combining multiple imaging modalities with AI analysis", TAM: "$4,600 M"},
            {id: 37, clusterNames: ["Cluster A"], name: "Preterm Labor Prediction System", problem: "Difficult prediction of preterm labor", aiHardwareSolution: "Wearable device predicting preterm labor days before onset", TAM: "$1,500 M"},
            {id: 38, clusterNames: ["Cluster B"], name: "Non-Invasive Fracture Healing Assessment", problem: "Limited assessment of bone healing", aiHardwareSolution: "Portable device assessing fracture healing progress non-invasively", TAM: "$1,070 M"},
            {id: 39, clusterNames: ["Cluster A"], name: "Multiple Sclerosis Flare Prediction", problem: "Inefficient management of multiple sclerosis flares", aiHardwareSolution: "Wearable system predicting MS flares before symptom onset", TAM: "$3,218 M"},
            {id: 40, clusterNames: ["Cluster G"], name: "Implant Infection Early Detection", problem: "Delayed detection of implant infections", aiHardwareSolution: "Non-invasive monitoring device detecting early infection biomarkers", TAM: "$1,000 M"},
            {id: 41, clusterNames: ["Cluster H"], name: "Remote Neuropsychological Assessment", problem: "Limited access to neuropsychological assessment", aiHardwareSolution: "Portable system providing comprehensive evaluation comparable to specialist testing", TAM: "$5,200 M"},
            {id: 42, clusterNames: [], name: "Non-Invasive Intracranial Pressure Monitoring", problem: "Difficult management of intracranial pressure", aiHardwareSolution: "Non-invasive monitoring system accurately estimating pressure", TAM: "$1,687 M"},
            {id: 43, clusterNames: ["Cluster F"], name: "AI-Optimized Prosthetic Fitting", problem: "Inefficient fitting of prosthetic limbs", aiHardwareSolution: "System designing and adjusting prosthetic fit based on gait patterns", TAM: "$1,950 M"},
            {id: 44, clusterNames: ["Cluster B"], name: "Early Pancreatic Cancer Detection", problem: "Limited early detection of pancreatic cancer", aiHardwareSolution: "Advanced endoscopic system with AI detecting precancerous changes", TAM: "$1,600 M"},
            {id: 45, clusterNames: ["Cluster A"], name: "Heart Failure Fluid Monitoring System", problem: "Difficult management of fluid status in heart failure", aiHardwareSolution: "Wearable device predicting decompensation days before symptoms", TAM: "$10,000 M"},
            {id: 46, clusterNames: ["Cluster D", "Cluster H"], name: "Objective Autism Screening Tool", problem: "Inefficient screening for autism spectrum disorders", aiHardwareSolution: "System using eye tracking and AI assessing social communication patterns", TAM: "$3,380 M"},
            {id: 47, clusterNames: ["Cluster F"], name: "AI Navigation System for Visual Impairment", problem: "Limited guidance for blind and visually impaired individuals", aiHardwareSolution: "Wearable device providing contextual environmental information", TAM: "$4,200 M"},
            {id: 48, clusterNames: ["Cluster A"], name: "Non-Invasive Transplant Rejection Monitor", problem: "Difficult monitoring of transplant rejection", aiHardwareSolution: "Wearable device monitoring biomarkers for early rejection signs", TAM: "$939 M"},
            {id: 49, clusterNames: ["Cluster A", "Cluster H"], name: "Advanced Seizure Prediction System", problem: "Unpredictable seizures in epilepsy", aiHardwareSolution: "Wearable EEG with AI predicting seizure likelihood hours in advance", TAM: "$750 M"},
            {id: 50, clusterNames: [], name: "Precision Radiation Dosimetry System", problem: "Limited precision in radiation dosimetry", aiHardwareSolution: "Wearable sensors mapping personalized radiation dose distribution", TAM: "$3,440 M"}
        ]
    };
    
    // Process opportunities from the embedded data
    ideaClusterData.opportunities.forEach(opp => {
        // Determine color based on cluster (use the first cluster if multiple)
        let color = "#FFFFFF"; // Default white for no cluster
        if (opp.clusterNames && opp.clusterNames.length > 0) {
            color = clusterNames[opp.clusterNames[0]].color;
        }
        
        // Add node
        data.nodes.push({
            id: `opp-${opp.id}`,
            name: opp.name,
            type: "opportunity",
            problem: opp.problem,
            solution: opp.aiHardwareSolution,
            tam: opp.TAM,
            value: 10,
            color: color
        });
        
        // Add links to clusters
        if (opp.clusterNames) {
            opp.clusterNames.forEach(cluster => {
                if (clusterNames[cluster]) {  // Check if the cluster exists
                    data.links.push({
                        source: `opp-${opp.id}`,
                        target: clusterNames[cluster].id,
                        value: 1
                    });
                }
            });
        }
    });
    
    // Create the visualization
    createVisualization();
    
    // Function to create the visualization
    function createVisualization() {

    // Create the visualization
    const width = document.querySelector('#graph-panel').clientWidth;
    const height = document.querySelector('#graph-panel').clientHeight;
    
    // Create SVG
    const svg = d3.select("#graph-panel .visualization")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Add zoom functionality
    const zoom = d3.zoom()
        .scaleExtent([0.2, 5])
        .on("zoom", (event) => {
            container.attr("transform", event.transform);
        });
    
    svg.call(zoom);
    
    const container = svg.append("g");
    
    // Handle mobile vs desktop sizing
    const isMobile = window.innerWidth < 768;
    const nodeRadius = isMobile ? 15 : 10;
    const linkDistance = isMobile ? 80 : 100;
    const chargeStrength = isMobile ? -200 : -300;
    
    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(linkDistance))
        .force("charge", d3.forceManyBody().strength(chargeStrength))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => (d.type === "cluster" ? 20 : nodeRadius) * 1.5))
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05));
    
    // Create links
    const link = container.append("g")
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("class", "link")
        .attr("stroke", d => {
            const targetNode = data.nodes.find(node => node.id === d.target.id || node.id === d.target);
            return targetNode ? targetNode.color : "#666";
        })
        .attr("stroke-width", d => Math.sqrt(d.value) * 2);
    
    // Create nodes
    const node = container.append("g")
        .selectAll(".node")
        .data(data.nodes)
        .join("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    // Add circles for nodes
    node.append("circle")
        .attr("r", d => d.type === "cluster" ? 20 : nodeRadius)
        .attr("fill", d => d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("class", d => d.type === "cluster" ? "cluster-node hover-glow" : "hover-glow")
        .on("click", showInfo);
    
    // Add text labels with mobile optimization
    node.append("text")
        .attr("dx", d => d.type === "cluster" ? 0 : (isMobile ? 16 : 12))
        .attr("dy", d => d.type === "cluster" ? 0 : 4)
        .attr("text-anchor", d => d.type === "cluster" ? "middle" : "start")
        .text(d => {
            // Shorter text on mobile
            if (isMobile) {
                return d.name.length > 20 ? d.name.substring(0, 17) + "..." : d.name;
            } else {
                return d.name.length > 30 ? d.name.substring(0, 27) + "..." : d.name;
            }
        })
        .attr("font-size", d => d.type === "cluster" ? (isMobile ? 10 : 12) : (isMobile ? 8 : 10))
        .attr("font-weight", d => d.type === "cluster" ? "bold" : "normal");
    
    // Update positions on tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    // Info panel functions
    function showInfo(event, d) {
        const infoPanel = document.querySelector(".info-panel");
        const infoTitle = document.querySelector(".info-title");
        const infoContent = document.querySelector(".info-content");
        
        infoTitle.textContent = d.name;
        
        let content = "";
        if (d.type === "cluster") {
            content = `
                <p><strong>Type:</strong> Technology Platform</p>
                <p><strong>Description:</strong> ${d.description}</p>
                <p><strong>Market Opportunity:</strong> ${d.market}</p>
                <p>This cluster contains multiple healthcare innovation opportunities that leverage edge AI technology.</p>
            `;
        } else {
            content = `
                <p><strong>Problem:</strong> ${d.problem}</p>
                <p><strong>Solution:</strong> ${d.solution}</p>
                <p><strong>Market Size (TAM):</strong> ${d.tam}</p>
            `;
        }
        
        infoContent.innerHTML = content;
        infoPanel.classList.add("visible");
        
        // Highlight connected nodes and links
        highlightConnections(d);
    }
    
    // Hide info panel when clicking elsewhere
    svg.on("click", function(event) {
        if (event.target === this) {
            document.querySelector(".info-panel").classList.remove("visible");
            
            // Reset highlighting
            resetHighlights();
        }
    });
    
    // Close button for info panel (mobile friendly)
    document.querySelector(".info-panel-close").addEventListener("click", function() {
        document.querySelector(".info-panel").classList.remove("visible");
        resetHighlights();
    });
    
    // Function to highlight connections
    function highlightConnections(d) {
        resetHighlights();
        
        // Find all connected links and nodes
        const connectedNodeIds = [d.id];
        
        // Find directly connected nodes through links
        data.links.forEach(link => {
            if (link.source.id === d.id) {
                connectedNodeIds.push(link.target.id);
            } else if (link.target.id === d.id) {
                connectedNodeIds.push(link.source.id);
            }
        });
        
        // Dim all nodes and links
        d3.selectAll(".link").style("opacity", 0.1);
        node.selectAll("circle").style("opacity", 0.2);
        node.selectAll("text").style("opacity", 0.2);
        
        // Highlight connected nodes and links
        node.filter(node => connectedNodeIds.includes(node.id)).selectAll("circle").style("opacity", 1);
        node.filter(node => connectedNodeIds.includes(node.id)).selectAll("text").style("opacity", 1);
        
        d3.selectAll(".link").filter(link => 
            connectedNodeIds.includes(link.source.id) && connectedNodeIds.includes(link.target.id)
        ).style("opacity", 1);
    }
    
    // Reset highlights
    function resetHighlights() {
        d3.selectAll(".link").style("opacity", 0.5);
        node.selectAll("circle").style("opacity", 1);
        node.selectAll("text").style("opacity", 1);
    }
    
    // Control buttons
    document.getElementById("reset-zoom").addEventListener("click", function() {
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    });
    
    document.getElementById("toggle-layout").addEventListener("click", function() {
        simulation
            .force("charge", d3.forceManyBody().strength(-300 * Math.random() * 2))
            .alpha(1)
            .restart();
    });
    
    // Initial zoom to fit - different for mobile
    const initialScale = isMobile ? 0.6 : 0.8;
    const initialTranslateX = isMobile ? width / 3 : width / 5;
    const initialTranslateY = isMobile ? height / 3 : height / 4;
    const initialTransform = d3.zoomIdentity.scale(initialScale).translate(initialTranslateX, initialTranslateY);
    svg.call(zoom.transform, initialTransform);
    
    // Add touch event listeners for mobile
    if ('ontouchstart' in window) {
        // Prevent zoom issues on mobile
        document.addEventListener('touchmove', function(event) {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        }, { passive: false });
        
        // Double tap to reset view
        let lastTap = 0;
        svg.node().addEventListener('touchend', function(event) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected
                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity.scale(initialScale).translate(initialTranslateX, initialTranslateY)
                );
            }
            lastTap = currentTime;
        });
    }
}
}