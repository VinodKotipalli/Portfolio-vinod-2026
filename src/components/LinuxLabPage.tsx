import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Cpu,
  Layers,
  Play,
  CheckCircle2,
  X,
} from 'lucide-react';

interface LinuxLabPageProps {
  onBackToPortfolio: () => void;
}

interface CommandHistoryItem {
  id: string;
  mode: 'linux' | 'k8s';
  command: string;
  output: string;
  cwd: string;
}

const CURATED_LAB_COMMANDS: Record<
  'linux' | 'k8s',
  { category: string; items: { cmd: string; desc: string }[] }[]
> = {
  linux: [
    {
      category: 'System & Process Triage',
      items: [
        { cmd: 'uname -a', desc: 'Display Linux kernel & system architecture' },
        { cmd: 'uptime', desc: 'Check system uptime & load averages' },
        { cmd: 'free -h', desc: 'Inspect memory and swap utilization' },
        { cmd: 'df -h', desc: 'View mounted filesystem disk space' },
        { cmd: 'ps aux', desc: 'List running processes across system' },
        { cmd: 'top -b -n 1', desc: 'Snapshot of real-time CPU & memory tasks' },
      ],
    },
    {
      category: 'Networking & Observability',
      items: [
        { cmd: 'ss -tulpn', desc: 'Inspect active listening TCP/UDP sockets' },
        { cmd: 'ss -tulpn | grep 80', desc: 'Filter listening web server port 80' },
        { cmd: 'ip addr show', desc: 'Display network interfaces & private IPv4' },
        { cmd: 'curl -I http://localhost:9090/metrics', desc: 'Check Prometheus metrics endpoint headers' },
        { cmd: 'systemctl status prometheus', desc: 'Verify Prometheus systemd unit health' },
        { cmd: 'journalctl -u nginx -n 5', desc: 'Tail recent systemd service logs' },
      ],
    },
    {
      category: 'Filesystem & Terraform Configs',
      items: [
        { cmd: 'ls -la', desc: 'List directory contents with permissions' },
        { cmd: 'cat main.tf', desc: 'Inspect AWS VPC & EKS Terraform configuration' },
        { cmd: 'cat prometheus.yml', desc: 'View Prometheus scrape job configuration' },
        { cmd: 'whoami', desc: 'Display active shell user' },
      ],
    },
  ],
  k8s: [
    {
      category: 'Cluster & Node Inspection',
      items: [
        { cmd: 'kubectl version --short', desc: 'Verify client & Amazon EKS control plane version' },
        { cmd: 'kubectl get nodes -o wide', desc: 'List EKS managed EC2 worker nodes' },
        { cmd: 'kubectl top nodes', desc: 'View worker node CPU and memory saturation' },
        { cmd: 'kubectl get namespaces', desc: 'List active cluster namespaces' },
      ],
    },
    {
      category: 'Workloads, HPA & Services',
      items: [
        { cmd: 'kubectl get pods -o wide', desc: 'List running pods across availability zones' },
        { cmd: 'kubectl get deployments', desc: 'Inspect microservice deployment replicas' },
        { cmd: 'kubectl get svc', desc: 'View ClusterIP and AWS LoadBalancer services' },
        { cmd: 'kubectl get hpa', desc: 'Inspect Horizontal Pod Autoscaler thresholds' },
        { cmd: 'kubectl get ingress', desc: 'Check AWS ALB Ingress routing rules' },
      ],
    },
    {
      category: 'Helm & Diagnostics',
      items: [
        { cmd: 'helm list -A', desc: 'List deployed Helm charts across namespaces' },
        { cmd: 'kubectl logs deploy/api-gateway --tail=10', desc: 'Inspect recent application pod logs' },
        { cmd: 'kubectl describe hpa api-gateway-hpa', desc: 'View detailed autoscaling events' },
      ],
    },
  ],
};

export const LinuxLabPage: React.FC<LinuxLabPageProps> = ({ onBackToPortfolio }) => {
  const [labMode, setLabMode] = useState<'linux' | 'k8s'>('linux');
  const [inputCmd, setInputCmd] = useState('');
  const [cwd, setCwd] = useState('/home/devops/aws-infra');
  const [commandCount, setCommandCount] = useState(0);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      id: 'init-banner',
      mode: 'linux',
      command: 'motd',
      cwd: '/home/devops/aws-infra',
      output: `Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-1015-aws x86_64)
Saivinod Kotipalli — Interactive AWS DevOps & Kubernetes Practice Workstation
Environment: Sandboxed Virtual Shell · Zero Lockouts · Type 'help' or click any command on the left.`,
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const evaluateCommand = (rawCmd: string, currentMode: 'linux' | 'k8s'): string => {
    const cmd = rawCmd.trim();
    if (!cmd) return '';

    if (cmd === 'help') {
      return `Available Sandbox Commands:
  Linux System:  uname -a, uptime, whoami, hostname, free -h, df -h, ps aux, top -b -n 1
  Networking:    ss -tulpn, ss -tulpn | grep 80, ip addr show, curl -I http://localhost:9090/metrics
  Services/Logs: systemctl status prometheus, systemctl status grafana-server, journalctl -u nginx -n 5
  Files & IaC:   pwd, ls -la, cat main.tf, cat prometheus.yml, terraform version, aws --version
  Kubernetes:    kubectl get nodes -o wide, kubectl get pods -o wide, kubectl get svc, kubectl get hpa,
                 kubectl top nodes, kubectl get deployments, kubectl get ingress, helm list -A
  Utility:       clear, reset, date, echo <text>`;
    }

    if (cmd === 'whoami') return 'devops-sre (Saivinod Kotipalli Workstation)';
    if (cmd === 'hostname') return 'ip-10-0-14-82.ap-south-1.compute.internal';
    if (cmd === 'pwd') return cwd;
    if (cmd === 'date') return new Date().toUTCString();
    if (cmd.startsWith('echo ')) return cmd.slice(5).replace(/^["']|["']$/g, '');

    if (cmd === 'uname -a' || cmd === 'uname') {
      return 'Linux ip-10-0-14-82 6.8.0-1015-aws #16-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    }
    if (cmd === 'uptime') {
      return '14:22:09 up 142 days,  6:18,  1 user,  load average: 0.24, 0.31, 0.28';
    }
    if (cmd === 'free -h') {
      return `               total        used        free      shared  buff/cache   available
Mem:           15Gi       4.2Gi       6.8Gi        48Mi       4.6Gi        11Gi
Swap:         2.0Gi          0B       2.0Gi`;
    }
    if (cmd === 'df -h') {
      return `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1  100G   28G   72G  28% /
tmpfs           7.8G     0  7.8G   0% /dev/shm
/dev/nvme1n1    250G   64G  186G  26% /var/lib/prometheus`;
    }
    if (cmd === 'ps aux') {
      return `USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.1 168940 13200 ?        Ss   Jun01   4:12 /sbin/init
prometheus   312  1.8  4.2 2841920 682400 ?      Ssl  Jun01 182:40 /usr/local/bin/prometheus --config.file=/etc/prometheus/prometheus.yml
grafana      334  0.9  2.1 1420100 341200 ?      Ssl  Jun01  94:15 /usr/sbin/grafana-server
nginx        340  0.2  0.3  55280 28400 ?        S    Jun01  12:04 nginx: master process /usr/sbin/nginx
node_exp     388  0.4  0.2 728400 24100 ?        Ssl  Jun01  41:19 /usr/local/bin/node_exporter`;
    }
    if (cmd.startsWith('top')) {
      return `top - 14:25:01 up 142 days,  6:21,  1 user,  load average: 0.21, 0.29, 0.27
Tasks: 118 total,   1 running, 117 sleeping,   0 stopped,   0 zombie
%Cpu(s):  4.2 us,  1.4 sy,  0.0 ni, 94.1 id,  0.2 wa,  0.0 hi,  0.1 si
MiB Mem :  15884.0 total,   6912.4 free,   4310.2 used,   4661.4 buff/cache`;
    }
    if (cmd === 'ss -tulpn') {
      return `Netid  State   Recv-Q  Send-Q  Local Address:Port   Peer Address:Port  Process
tcp    LISTEN  0       511     0.0.0.0:80           0.0.0.0:*          users:(("nginx",pid=340,fd=6))
tcp    LISTEN  0       4096    0.0.0.0:3000         0.0.0.0:*          users:(("grafana",pid=334,fd=9))
tcp    LISTEN  0       4096    0.0.0.0:9090         0.0.0.0:*          users:(("prometheus",pid=312,fd=8))
tcp    LISTEN  0       4096    0.0.0.0:9100         0.0.0.0:*          users:(("node_exporter",pid=388,fd=3))`;
    }
    if (cmd === 'ss -tulpn | grep 80') {
      return `tcp  0  0 0.0.0.0:80  0.0.0.0:*  LISTEN  340/nginx`;
    }
    if (cmd === 'ip addr show' || cmd === 'ip a') {
      return `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN
    inet 127.0.0.1/8 scope host lo
2: ens5: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 state UP
    inet 10.0.14.82/24 brd 10.0.14.255 scope global dynamic ens5`;
    }
    if (cmd.startsWith('curl')) {
      return `HTTP/1.1 200 OK
Content-Type: text/plain; version=0.0.4; charset=utf-8
Date: ${new Date().toUTCString()}
X-Prometheus-Scrape-Latency-Seconds: 0.0042`;
    }
    if (cmd === 'systemctl status prometheus') {
      return `● prometheus.service - Prometheus Time-Series Monitoring Server
     Loaded: loaded (/etc/systemd/system/prometheus.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-06-01 08:00:12 UTC; 4 months ago
   Main PID: 312 (prometheus)
      Tasks: 14 (limit: 18942)
     Memory: 668.4M
     Status: "Server is ready to receive web requests."`;
    }
    if (cmd.startsWith('journalctl')) {
      return `Oct 18 14:18:02 ip-10-0-14-82 nginx[340]: 10.0.1.15 - - "GET /healthz HTTP/1.1" 200 2 "-" "ELB-HealthChecker/2.0"
Oct 18 14:18:17 ip-10-0-14-82 nginx[340]: 10.0.2.44 - - "GET /api/v1/status HTTP/1.1" 200 148 "-" "kube-probe/1.30"
Oct 18 14:18:32 ip-10-0-14-82 nginx[340]: 10.0.1.15 - - "GET /healthz HTTP/1.1" 200 2 "-" "ELB-HealthChecker/2.0"`;
    }
    if (cmd === 'ls' || cmd === 'ls -la' || cmd === 'ls -l') {
      return `drwxr-xr-x 5 devops devops 4096 Oct 18 12:00 .
drwxr-xr-x 3 root   root   4096 Jun 01 08:00 ..
-rw-r--r-- 1 devops devops 2480 Oct 18 11:42 main.tf
-rw-r--r-- 1 devops devops 1120 Oct 18 11:42 variables.tf
-rw-r--r-- 1 devops devops 1840 Oct 18 10:15 prometheus.yml
drwxr-xr-x 3 devops devops 4096 Oct 15 09:30 helm-charts
drwxr-xr-x 2 devops devops 4096 Oct 12 16:20 .github`;
    }
    if (cmd === 'cat main.tf') {
      return `terraform {
  backend "s3" {
    bucket         = "saivinod-tf-remote-state-prod"
    key            = "aws-multi-tier/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    kms_key_id     = "alias/terraform-state-kms"
    dynamodb_table = "terraform-state-locks"
  }
}

module "vpc" {
  source             = "./modules/vpc"
  cidr_block         = "10.0.0.0/16"
  availability_zones = ["ap-south-1a", "ap-south-1b"]
}`;
    }
    if (cmd === 'cat prometheus.yml') {
      return `global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "/etc/prometheus/rules/sla_alerts.yml"

scrape_configs:
  - job_name: "node-exporter"
    static_configs:
      - targets: ["10.0.14.82:9100", "10.0.15.41:9100"]
  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod`;
    }
    if (cmd === 'terraform version') {
      return 'Terraform v1.9.5 on linux_amd64\n+ provider registry.terraform.io/hashicorp/aws v5.68.0';
    }
    if (cmd === 'aws --version') {
      return 'aws-cli/2.18.4 Python/3.12.6 Linux/6.8.0-1015-aws exe/x86_64.ubuntu.24';
    }

    // Kubernetes commands
    if (cmd === 'kubectl version --short' || cmd === 'kubectl version') {
      return `Client Version: v1.30.2
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
Server Version: v1.30.2-eks-db838b0`;
    }
    if (cmd.startsWith('kubectl get nodes')) {
      return `NAME                                         STATUS   ROLES    AGE   VERSION               INTERNAL-IP
ip-10-0-14-82.ap-south-1.compute.internal    Ready    <none>   94d   v1.30.2-eks-db838b0   10.0.14.82
ip-10-0-15-41.ap-south-1.compute.internal    Ready    <none>   94d   v1.30.2-eks-db838b0   10.0.15.41
ip-10-0-16-19.ap-south-1.compute.internal    Ready    <none>   94d   v1.30.2-eks-db838b0   10.0.16.19`;
    }
    if (cmd === 'kubectl top nodes') {
      return `NAME                                         CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
ip-10-0-14-82.ap-south-1.compute.internal    640m         32%    4210Mi          54%
ip-10-0-15-41.ap-south-1.compute.internal    580m         29%    3890Mi          50%
ip-10-0-16-19.ap-south-1.compute.internal    510m         25%    3640Mi          47%`;
    }
    if (cmd === 'kubectl get namespaces' || cmd === 'kubectl get ns') {
      return `NAME              STATUS   AGE
default           Active   94d
kube-system       Active   94d
production        Active   90d
monitoring        Active   88d
ingress-nginx     Active   90d`;
    }
    if (cmd.startsWith('kubectl get pods')) {
      return `NAME                              READY   STATUS    RESTARTS   AGE   IP            NODE
frontend-web-7d9c8b6f4-x2k9p      1/1     Running   0          4d    10.0.14.112   ip-10-0-14-82.ap-south-1.compute.internal
frontend-web-7d9c8b6f4-m9p4q      1/1     Running   0          4d    10.0.15.204   ip-10-0-15-41.ap-south-1.compute.internal
api-gateway-5f8b4a9c2-q4l8v       1/1     Running   0          6d    10.0.14.155   ip-10-0-14-82.ap-south-1.compute.internal
api-gateway-5f8b4a9c2-v8z2m       1/1     Running   0          6d    10.0.16.88    ip-10-0-16-19.ap-south-1.compute.internal
prometheus-server-0               2/2     Running   0          32d   10.0.15.91    ip-10-0-15-41.ap-south-1.compute.internal
grafana-deployment-6b8c9d-k7w2x   1/1     Running   0          32d   10.0.16.102   ip-10-0-16-19.ap-south-1.compute.internal`;
    }
    if (cmd === 'kubectl get deployments' || cmd === 'kubectl get deploy') {
      return `NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
frontend-web         2/2     2            2           90d
api-gateway          2/2     2            2           90d
grafana-deployment   1/1     1            1           88d`;
    }
    if (cmd === 'kubectl get svc' || cmd === 'kubectl get services') {
      return `NAME                  TYPE           CLUSTER-IP       EXTERNAL-IP                                                              PORT(S)        AGE
frontend-web-svc      ClusterIP      172.20.44.12     <none>                                                                   80/TCP         90d
api-gateway-svc       ClusterIP      172.20.118.90    <none>                                                                   8080/TCP       90d
aws-alb-ingress       LoadBalancer   172.20.201.45    k8s-prod-alb-89123456.ap-south-1.elb.amazonaws.com                       80:31240/TCP   90d`;
    }
    if (cmd === 'kubectl get hpa') {
      return `NAME              REFERENCE                TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
frontend-web-hpa  Deployment/frontend-web  41%/70%         2         8         2          85d
api-gateway-hpa   Deployment/api-gateway   54%/70%         2         10        2          85d`;
    }
    if (cmd === 'kubectl get ingress') {
      return `NAME               CLASS   HOSTS                                  ADDRESS                                              PORTS     AGE
prod-app-ingress   alb     saivinodkotipalliportfolio.online      k8s-prod-alb-89123456.ap-south-1.elb.amazonaws.com   80, 443   90d`;
    }
    if (cmd === 'helm list -A' || cmd === 'helm ls') {
      return `NAME                  NAMESPACE     REVISION  UPDATED                                 STATUS    CHART                         APP VERSION
aws-load-balancer     kube-system   3         2026-08-12 09:14:22.104921 +0000 UTC    deployed  aws-load-balancer-controller  v2.8.1
kube-prometheus-stack monitoring    5         2026-09-04 14:30:10.448120 +0000 UTC    deployed  kube-prometheus-stack-61.3.0  v0.75.0
prod-microservices    production    18        2026-10-15 11:20:05.882104 +0000 UTC    deployed  microservices-chart-2.4.0     v2.4.0`;
    }
    if (cmd.startsWith('kubectl logs')) {
      return `2026-10-18T14:20:01.102Z INFO  [api-gateway] IRSA IAM session validated for arn:aws:iam::837140640323:role/eks-api-role
2026-10-18T14:20:04.418Z INFO  [api-gateway] Connected to Multi-AZ RDS PostgreSQL pool (max_conns=50, active=8)
2026-10-18T14:20:10.005Z INFO  [api-gateway] Readiness & Liveness health probes returning HTTP 200 OK (latency=2.1ms)`;
    }
    if (cmd.startsWith('kubectl describe hpa')) {
      return `Name:                                                  api-gateway-hpa
Namespace:                                             production
Reference:                                             Deployment/api-gateway
Metrics:                                               ( current / target )
  resource cpu on pods  (as a percentage of request):  54% (270m) / 70%
Min replicas:                                          2
Max replicas:                                          10
Deployment pods:                                       2 current / 2 desired
Events:                                                <none>`;
    }

    return `Executed in ${currentMode === 'k8s' ? 'Amazon EKS Sandbox' : 'Ubuntu 24.04 LTS Sandbox'}: '${cmd}'
Tip: Try 'help' or select a curated DevOps command from the sidebar.`;
  };

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    if (trimmed === 'clear' || trimmed === 'reset') {
      setHistory([]);
      setInputCmd('');
      return;
    }

    const result = evaluateCommand(trimmed, labMode);
    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        mode: labMode,
        command: trimmed,
        output: result,
        cwd,
      },
    ]);
    setCommandCount((c) => c + 1);
    setInputCmd('');
    inputRef.current?.focus();
  };

  const handleResetEnvironment = () => {
    setCwd('/home/devops/aws-infra');
    setHistory([
      {
        id: `reset-${Date.now()}`,
        mode: labMode,
        command: 'reset-sandbox',
        cwd: '/home/devops/aws-infra',
        output:
          'Sandbox virtual filesystem and Amazon EKS v1.30.2 state reset to clean baseline.',
      },
    ]);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#090D14] text-slate-100 flex flex-col overflow-hidden font-sans-body">
      {/* Top Workstation Header */}
      <header className="px-4 sm:px-6 py-3 bg-[#0D121C] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToPortfolio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-tech text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-display font-bold text-white truncate">
              {labMode === 'k8s'
                ? 'Kubernetes Sandbox Lab (Amazon EKS v1.30.2)'
                : 'Ubuntu 24.04 LTS DevOps Practice Workstation'}
            </h1>
            <p className="text-[11px] font-mono-tech text-slate-400 hidden md:block truncate">
              Saivinod Kotipalli · Interactive Shell &amp; Command Runner · Zero Lockouts
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="hidden md:flex items-center bg-black/50 border border-white/10 p-1 rounded-lg text-xs font-mono-tech">
          <button
            type="button"
            onClick={() => setLabMode('linux')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
              labMode === 'linux'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Linux Workstation</span>
          </button>
          <button
            type="button"
            onClick={() => setLabMode('k8s')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
              labMode === 'k8s'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kubernetes Lab</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden xl:inline-block text-xs font-mono-tech text-slate-400 mr-2">
            Executed: <strong className="text-emerald-400">{commandCount}</strong>
          </span>
          <button
            type="button"
            onClick={() => setShowRoadmapModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-tech text-slate-200 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">DevOps Modules</span>
          </button>
          <button
            type="button"
            onClick={handleResetEnvironment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-tech text-slate-200 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reset Sandbox</span>
          </button>
        </div>
      </header>

      {/* Main Split Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Command Palette Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0B0F17] p-4 overflow-y-auto max-h-[38vh] lg:max-h-full">
          <div className="flex md:hidden items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setLabMode('linux')}
              className={`flex-1 py-1.5 rounded text-xs font-mono-tech border ${
                labMode === 'linux'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'border-white/10 text-slate-400'
              }`}
            >
              Linux Lab
            </button>
            <button
              type="button"
              onClick={() => setLabMode('k8s')}
              className={`flex-1 py-1.5 rounded text-xs font-mono-tech border ${
                labMode === 'k8s'
                  ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                  : 'border-white/10 text-slate-400'
              }`}
            >
              Kubernetes Lab
            </button>
          </div>

          <div className="mb-4">
            <span className="text-[11px] font-mono-tech uppercase tracking-wider text-cyan-400 block mb-1">
              Click to Run Immediately
            </span>
            <h2 className="text-sm font-display font-semibold text-white">
              Curated {labMode === 'k8s' ? 'Amazon EKS & kubectl' : 'Linux & SRE'} Commands
            </h2>
          </div>

          <div className="space-y-5">
            {CURATED_LAB_COMMANDS[labMode].map((group) => (
              <div key={group.category} className="space-y-2">
                <h3 className="text-xs font-mono-tech font-semibold text-slate-400">
                  {group.category}
                </h3>
                <div className="space-y-1.5">
                  {group.items.map((item) => (
                    <button
                      key={item.cmd}
                      type="button"
                      onClick={() => executeCommand(item.cmd)}
                      className="w-full text-left p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <code className="text-xs font-mono-tech text-emerald-300 group-hover:text-cyan-300 truncate">
                          $ {item.cmd}
                        </code>
                        <Play className="w-3 h-3 text-slate-500 group-hover:text-cyan-300 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Interactive Terminal Shell */}
        <main
          className="lg:col-span-8 xl:col-span-9 flex flex-col bg-[#06080E] overflow-hidden"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto font-mono-tech text-xs sm:text-sm space-y-4">
            {history.map((entry) => (
              <div key={entry.id} className="space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="font-semibold">
                    devops@saivinod-aws:{entry.cwd}$
                  </span>
                  <span className="text-white">{entry.command}</span>
                </div>
                {entry.output && (
                  <pre className="text-slate-300 whitespace-pre-wrap break-words leading-relaxed pl-3 border-l border-white/15">
                    {entry.output}
                  </pre>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeCommand(inputCmd);
            }}
            className="p-3 sm:p-4 bg-[#0B0F19] border-t border-white/10 flex items-center gap-2 font-mono-tech text-xs sm:text-sm"
          >
            <span className="text-emerald-400 font-semibold shrink-0">
              devops@saivinod-aws:{cwd}$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              placeholder="Type a Linux or kubectl command (e.g. ss -tulpn | grep 80, kubectl get pods, help)..."
              className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-slate-600"
              autoFocus
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Run
            </button>
          </form>
        </main>
      </div>

      {/* DevOps Practice Lab Modules Modal */}
      {showRoadmapModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowRoadmapModal(false)}
        >
          <div
            className="bg-[#111622] border border-white/15 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowRoadmapModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono-tech text-cyan-400 block mb-1">
                DevOps Practice Lab Track
              </span>
              <h3 className="text-xl font-display font-bold text-white">
                Interactive DevOps Practice Modules
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Switch between Ubuntu 24.04 LTS system administration and Amazon EKS cluster orchestration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => {
                  setLabMode('linux');
                  setShowRoadmapModal(false);
                }}
                className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-1.5 cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <div className="flex items-center justify-between text-emerald-300 font-semibold">
                  <span>Linux Practice Lab</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  VFS filesystem, permissions, process triage (ps, top), networking (ss, curl), and Prometheus/Terraform configs.
                </p>
              </div>

              <div
                onClick={() => {
                  setLabMode('k8s');
                  setShowRoadmapModal(false);
                }}
                className="p-4 rounded-xl border border-violet-500/40 bg-violet-950/20 space-y-1.5 cursor-pointer hover:border-violet-400 transition-colors"
              >
                <div className="flex items-center justify-between text-violet-300 font-semibold">
                  <span>Kubernetes EKS Lab</span>
                  <Cpu className="w-4 h-4 text-violet-400" />
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  kubectl mastery: Nodes, Pods, Deployments, Services, HPA autoscaling, ALB Ingress, and Helm releases.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
