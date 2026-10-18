import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ArchitectureVisualizerProps {
  projectIndex: number;
  theme: 'light' | 'dark';
}

export const ArchitectureVisualizer: React.FC<ArchitectureVisualizerProps> = ({
  projectIndex,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [activeStage, setActiveStage] = useState<number>(0);
  const [selectedEnv, setSelectedEnv] = useState<'dev' | 'staging' | 'prod'>('prod');

  // 0: 01 — AWS Multi-Tier Infrastructure with Terraform
  if (projectIndex === 0) {
    const tiers = [
      {
        name: 'Presentation Tier (Public Subnets)',
        azA: 'ALB Node (ap-south-1a) · NAT Gateway',
        azB: 'ALB Node (ap-south-1b) · Bastion Host',
        detail: 'SSL/TLS Termination · Path Routing · Ingress :443',
        accent: 'cyan',
      },
      {
        name: 'Application Compute Tier (Private Subnets)',
        azA: 'EC2 Auto Scaling Group (AZ-1a)',
        azB: 'EC2 Auto Scaling Group (AZ-1b)',
        detail: 'Launch Templates · Self-Healing Capacity · Security Groups',
        accent: 'violet',
      },
      {
        name: 'Persistence Tier (Isolated DB Subnets)',
        azA: 'Amazon RDS PostgreSQL (Primary)',
        azB: 'Amazon RDS PostgreSQL (Standby Replica)',
        detail: 'Synchronous Multi-AZ Replication · KMS Encryption at Rest',
        accent: 'cyan',
      },
    ];

    return (
      <div
        className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors ${
          isDark
            ? 'bg-[#080B12] border-white/10 text-slate-200'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono-tech text-cyan-400 block">
              Sample Architecture Diagram · Interactive Tier Inspector
            </span>
            <h4 className="text-sm sm:text-base font-display font-semibold text-white">
              AWS VPC 3-Tier Multi-AZ Topology (Provisioned via Terraform)
            </h4>
          </div>
          <span className="text-[11px] font-mono-tech text-slate-400">
            vpc-0a8f92e1 · 10.0.0.0/16
          </span>
        </div>

        <div className="space-y-3">
          {tiers.map((tier, idx) => {
            const isSelected = activeStage === idx;
            return (
              <div
                key={tier.name}
                onMouseEnter={() => setActiveStage(idx)}
                onClick={() => setActiveStage(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/[0.06] border-cyan-400/50'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-display font-semibold text-white">
                    0{idx + 1}. {tier.name}
                  </span>
                  <span className="text-[11px] font-mono-tech text-cyan-300">
                    {tier.detail}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono-tech">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-300 flex items-center justify-between">
                    <span>Availability Zone A</span>
                    <span className="text-cyan-300">{tier.azA}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-300 flex items-center justify-between">
                    <span>Availability Zone B</span>
                    <span className="text-violet-300">{tier.azB}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 1: 02 — Amazon EKS Kubernetes Deployment Platform
  if (projectIndex === 1) {
    const pods = [
      { name: 'frontend-ui-7d9c8b-x2k', cpu: '42m', mem: '118Mi', probe: 'Readiness: 200 OK', role: 'IRSA: web-sa' },
      { name: 'frontend-ui-7d9c8b-m9p', cpu: '38m', mem: '112Mi', probe: 'Readiness: 200 OK', role: 'IRSA: web-sa' },
      { name: 'api-service-5f8b4a-q4l', cpu: '64m', mem: '245Mi', probe: 'Liveness: Healthy', role: 'IRSA: s3-rds-sa' },
      { name: 'api-service-5f8b4a-v8z', cpu: '59m', mem: '238Mi', probe: 'Liveness: Healthy', role: 'IRSA: s3-rds-sa' },
    ];

    return (
      <div
        className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors ${
          isDark
            ? 'bg-[#080B12] border-white/10 text-slate-200'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono-tech text-violet-400 block">
              Sample Cluster Topology · Simulated EKS Control Plane
            </span>
            <h4 className="text-sm sm:text-base font-display font-semibold text-white">
              Amazon EKS v1.30 · Helm Release &amp; Horizontal Pod Autoscaler (HPA)
            </h4>
          </div>
          <span className="text-[11px] font-mono-tech text-emerald-400">
            HPA Target: CPU &lt; 70% (Active: 4/8 Replicas)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {pods.map((pod, i) => (
            <motion.div
              key={pod.name}
              whileHover={{ y: -2 }}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-violet-400/50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-mono-tech mb-1.5">
                <span className="text-white font-semibold truncate">{pod.name}</span>
                <span className="text-emerald-400">Running</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
                <span>CPU: {pod.cpu} · Mem: {pod.mem}</span>
                <span className="text-cyan-300">{pod.role}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 text-[10px] font-mono-tech text-slate-400 flex justify-between">
                <span>{pod.probe}</span>
                <span>NodeGroup-0{(i % 2) + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] font-mono-tech text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <span>Registry: Amazon ECR (Multi-Stage Docker)</span>
          <span>·</span>
          <span>DNS: CoreDNS</span>
          <span>·</span>
          <span>Auth: OIDC + AWS IAM Roles for Service Accounts (IRSA)</span>
        </div>
      </div>
    );
  }

  // 2: 03 — GitHub Actions CI/CD Automation
  if (projectIndex === 2) {
    const stages = [
      {
        step: '01. Lint & Unit Test',
        tool: 'GitHub Actions Runner',
        duration: '38s',
        detail: 'Automated static code analysis, syntax validation, and unit test suite execution on PR / Merge.',
      },
      {
        step: '02. Trivy Security Scan',
        tool: 'Aqua Trivy Vulnerability Scanner',
        duration: '44s',
        detail: 'Scans multi-stage Docker container image and OS dependencies for CVEs (0 Critical / High allowed).',
      },
      {
        step: '03. Amazon ECR Publish',
        tool: 'AWS OIDC + Amazon ECR',
        duration: '52s',
        detail: 'Tags immutable semantic version & git SHA, pushes encrypted container artifact to Amazon ECR.',
      },
      {
        step: '04. Helm GitOps Deploy',
        tool: 'Helm + Amazon EKS Rollout',
        duration: '41s',
        detail: 'Executes zero-downtime rolling upgrade with readiness verification and automatic rollback triggers.',
      },
    ];

    return (
      <div
        className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors ${
          isDark
            ? 'bg-[#080B12] border-white/10 text-slate-200'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono-tech text-cyan-400 block">
              Sample Pipeline Telemetry · Click Stage to Inspect
            </span>
            <h4 className="text-sm sm:text-base font-display font-semibold text-white">
              End-to-End GitHub Actions CI/CD &amp; DevSecOps Pipeline
            </h4>
          </div>
          <span className="text-[11px] font-mono-tech text-slate-400">
            Auth: GitHub OIDC → AWS IAM Role
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mb-4">
          {stages.map((st, idx) => {
            const active = activeStage === idx;
            return (
              <button
                key={st.step}
                type="button"
                onClick={() => setActiveStage(idx)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  active
                    ? 'bg-cyan-500/15 border-cyan-400 text-white'
                    : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/30'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono-tech mb-1">
                  <span className="text-emerald-400">✓ Passed</span>
                  <span className="text-slate-400">{st.duration}</span>
                </div>
                <div className="text-xs font-display font-semibold text-white mb-0.5">
                  {st.step}
                </div>
                <div className="text-[10px] font-mono-tech text-slate-400 truncate">
                  {st.tool}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs font-mono-tech text-slate-300">
          <div className="text-cyan-300 font-semibold mb-1">
            Stage Specification — {stages[activeStage].step}
          </div>
          <p className="text-slate-300 leading-relaxed">{stages[activeStage].detail}</p>
        </div>
      </div>
    );
  }

  // 3: 04 — Terraform Remote State & Multi-Environment Automation
  if (projectIndex === 3) {
    const envConfigs = {
      dev: {
        workspace: 'dev.tfvars',
        s3Key: 's3://tf-state-saivinod/env:/dev/terraform.tfstate',
        lockStatus: 'LockID: 89f2a1d0-dev (Unlocked · Idle)',
        kms: 'alias/terraform-state-kms-key (AES-256)',
        drift: '0 Resources Drifted · Last Plan: Clean',
      },
      staging: {
        workspace: 'staging.tfvars',
        s3Key: 's3://tf-state-saivinod/env:/staging/terraform.tfstate',
        lockStatus: 'LockID: 43c9b7e2-stg (Unlocked · Verified)',
        kms: 'alias/terraform-state-kms-key (AES-256)',
        drift: '0 Resources Drifted · Pre-Prod Validated',
      },
      prod: {
        workspace: 'prod.tfvars',
        s3Key: 's3://tf-state-saivinod/env:/prod/terraform.tfstate',
        lockStatus: 'LockID: f1e8c4a9-prd (DynamoDB State Lock Active)',
        kms: 'alias/terraform-state-kms-key (Strict IAM + KMS)',
        drift: '0 Resources Drifted · Versioned & Encrypted',
      },
    };

    const current = envConfigs[selectedEnv];

    return (
      <div
        className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors ${
          isDark
            ? 'bg-[#080B12] border-white/10 text-slate-200'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono-tech text-violet-400 block">
              Sample State Backend Inspector · Switch Workspace
            </span>
            <h4 className="text-sm sm:text-base font-display font-semibold text-white">
              Terraform S3 Remote State, KMS Encryption &amp; DynamoDB Locking
            </h4>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-black/60 border border-white/10">
            {(['dev', 'staging', 'prod'] as const).map((env) => (
              <button
                key={env}
                type="button"
                onClick={() => setSelectedEnv(env)}
                className={`px-3 py-1 rounded-md text-xs font-mono-tech uppercase transition-colors cursor-pointer ${
                  selectedEnv === env
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-tech">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-slate-400 block text-[10px] mb-1">S3 State Object URI</span>
            <span className="text-cyan-300 break-all">{current.s3Key}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-slate-400 block text-[10px] mb-1">DynamoDB Concurrency Lock</span>
            <span className="text-emerald-400">{current.lockStatus}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-slate-400 block text-[10px] mb-1">Server-Side KMS Encryption</span>
            <span className="text-violet-300">{current.kms}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-slate-400 block text-[10px] mb-1">Workspace &amp; Drift Status</span>
            <span className="text-white">{current.workspace} · {current.drift}</span>
          </div>
        </div>
      </div>
    );
  }

  // 4: 05 — AWS Observability with Prometheus & Grafana
  return (
    <div
      className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors ${
        isDark
          ? 'bg-[#080B12] border-white/10 text-slate-200'
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono-tech text-cyan-400 block">
            Sample Telemetry Preview · Simulated PromQL Metrics (Not Connected to Live Production)
          </span>
          <h4 className="text-sm sm:text-base font-display font-semibold text-white">
            Prometheus, Node Exporter, Grafana &amp; Alertmanager SRE Console
          </h4>
        </div>
        <span className="text-[11px] font-mono-tech text-emerald-400">
          Scrape Interval: 15s · Alertmanager: Healthy
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 font-mono-tech">
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="text-[10px] text-slate-400 mb-1">
            rate(http_requests_total[5m])
          </div>
          <div className="text-xl font-bold text-white mb-2">1,420 req/s</div>
          <div className="flex items-end gap-1 h-8">
            {[45, 52, 48, 60, 58, 68, 74, 70, 82, 78, 85, 80].map((v, idx) => (
              <div
                key={idx}
                className="flex-1 bg-cyan-400/70 rounded-t"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="text-[10px] text-slate-400 mb-1">
            node_memory_Active_bytes / Total
          </div>
          <div className="text-xl font-bold text-white mb-2">61.4% Utilized</div>
          <div className="flex items-end gap-1 h-8">
            {[55, 58, 56, 60, 62, 59, 61, 63, 60, 62, 61, 61].map((v, idx) => (
              <div
                key={idx}
                className="flex-1 bg-violet-400/70 rounded-t"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="text-[10px] text-slate-400 mb-1">
            histogram_quantile(0.99, latency)
          </div>
          <div className="text-xl font-bold text-emerald-400 mb-2">28.4 ms (p99)</div>
          <div className="text-[11px] text-slate-400 leading-snug">
            Slack &amp; Email Alertmanager routing active · 0 SLA Breaches
          </div>
        </div>
      </div>
    </div>
  );
};
