import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CloudNetworkCanvasProps {
  theme: 'light' | 'dark';
}

interface NodeItem {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  accent: 'cyan' | 'violet' | 'slate';
  tier: string;
}

const NODES: NodeItem[] = [
  { id: 'route53', label: 'Amazon Route 53', sublabel: 'DNS & Edge Routing', x: 14, y: 24, accent: 'cyan', tier: 'Edge Tier' },
  { id: 'alb', label: 'Application Load Balancer', sublabel: 'SSL/TLS · Target Groups', x: 38, y: 22, accent: 'cyan', tier: 'Public Subnet' },
  { id: 'eks', label: 'Amazon EKS Cluster', sublabel: 'Multi-AZ Worker Nodes · HPA', x: 64, y: 34, accent: 'violet', tier: 'Compute Tier' },
  { id: 'rds', label: 'Amazon RDS Multi-AZ', sublabel: 'PostgreSQL · KMS Encrypted', x: 84, y: 24, accent: 'cyan', tier: 'Data Tier' },
  { id: 'cicd', label: 'GitHub Actions & ECR', sublabel: 'Trivy Scan · Helm GitOps', x: 24, y: 68, accent: 'violet', tier: 'CI/CD Pipeline' },
  { id: 'tf', label: 'Terraform IaC State', sublabel: 'S3 Backend · DynamoDB Lock', x: 54, y: 74, accent: 'cyan', tier: 'IaC Automation' },
  { id: 'obs', label: 'Prometheus & Grafana', sublabel: 'PromQL · Alertmanager SRE', x: 84, y: 68, accent: 'violet', tier: 'Observability' },
];

const EDGES: { from: string; to: string; protocol: string; accent: 'cyan' | 'violet' }[] = [
  { from: 'route53', to: 'alb', protocol: 'HTTPS :443', accent: 'cyan' },
  { from: 'alb', to: 'eks', protocol: 'Ingress Controller', accent: 'cyan' },
  { from: 'eks', to: 'rds', protocol: 'TCP :5432 (Private)', accent: 'cyan' },
  { from: 'cicd', to: 'eks', protocol: 'Helm Upgrade / OIDC', accent: 'violet' },
  { from: 'tf', to: 'alb', protocol: 'VPC / Subnets IaC', accent: 'cyan' },
  { from: 'tf', to: 'eks', protocol: 'NodeGroups / IRSA', accent: 'violet' },
  { from: 'tf', to: 'rds', protocol: 'Multi-AZ Provision', accent: 'cyan' },
  { from: 'eks', to: 'obs', protocol: '/metrics :9090', accent: 'violet' },
];

export const CloudNetworkCanvas: React.FC<CloudNetworkCanvasProps> = ({ theme }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const getNode = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <div
      className={`relative w-full h-full min-h-[380px] sm:min-h-[440px] rounded-2xl border overflow-hidden transition-colors duration-500 flex flex-col justify-between p-5 sm:p-6 ${
        isDark
          ? 'bg-[#090C15]/90 border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.65)]'
          : 'bg-white/90 border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.06)]'
      }`}
    >
      {/* Subtle architectural coordinate grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.035) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top Header Strip */}
      <div className="relative z-10 flex items-center justify-between gap-4 pb-3 border-b border-slate-200/60 dark:border-white/10">
        <div>
          <span
            className={`text-[11px] font-mono-tech tracking-wider block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Architecture Blueprint · Sample Visualization
          </span>
          <h3
            className={`text-sm sm:text-base font-display font-semibold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            AWS Multi-Tier Cloud &amp; Observability Mesh
          </h3>
        </div>
        <div
          className={`text-[11px] font-mono-tech text-right ${
            isDark ? 'text-cyan-400' : 'text-cyan-700'
          }`}
        >
          ap-south-1 · Multi-AZ
        </div>
      </div>

      {/* Interactive SVG Cloud-Network Topology */}
      <div className="relative z-10 flex-1 w-full my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 600 320"
          className="w-full h-full max-h-[290px] overflow-visible select-none"
          role="img"
          aria-label="Interactive AWS DevOps Architecture Topology"
        >
          <defs>
            <linearGradient id="edgeCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={isDark ? '0.65' : '0.55'} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={isDark ? '0.65' : '0.55'} />
            </linearGradient>
            <linearGradient id="edgeViolet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={isDark ? '0.65' : '0.55'} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={isDark ? '0.65' : '0.55'} />
            </linearGradient>
          </defs>

          {/* Connecting lines */}
          {EDGES.map((edge, idx) => {
            const fromNode = getNode(edge.from);
            const toNode = getNode(edge.to);
            const x1 = (fromNode.x / 100) * 600;
            const y1 = (fromNode.y / 100) * 320;
            const x2 = (toNode.x / 100) * 600;
            const y2 = (toNode.y / 100) * 320;

            const isHighlighted =
              hoveredNode === null || hoveredNode === edge.from || hoveredNode === edge.to;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - 14;
            const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

            return (
              <g key={`${edge.from}-${edge.to}`} className="transition-opacity duration-300" style={{ opacity: isHighlighted ? 1 : 0.2 }}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={edge.accent === 'cyan' ? 'url(#edgeCyan)' : 'url(#edgeViolet)'}
                  strokeWidth={hoveredNode === edge.from || hoveredNode === edge.to ? 2 : 1.25}
                  strokeDasharray="4 4"
                />
                <motion.circle
                  r={2.8}
                  fill={edge.accent === 'cyan' ? '#06b6d4' : '#8b5cf6'}
                  initial={{ offsetDistance: '0%' }}
                  animate={{
                    cx: [x1, midX, x2],
                    cy: [y1, midY, y2],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3.4 + idx * 0.35,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: idx * 0.4,
                  }}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((node, i) => {
            const cx = (node.x / 100) * 600;
            const cy = (node.y / 100) * 320;
            const isHovered = hoveredNode === node.id;
            const strokeColor =
              node.accent === 'cyan'
                ? isDark
                  ? '#22d3ee'
                  : '#0891b2'
                : isDark
                ? '#a78bfa'
                : '#7c3aed';

            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                {/* Outer subtle halo on hover */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 24 : 18}
                  fill={node.accent === 'cyan' ? 'rgba(6,182,212,0.08)' : 'rgba(139,92,246,0.08)'}
                  className="transition-all duration-300"
                />

                {/* Core Node Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={10}
                  fill={isDark ? '#0B0F19' : '#FFFFFF'}
                  stroke={strokeColor}
                  strokeWidth={isHovered ? 2.2 : 1.5}
                />

                {/* Inner precision point */}
                <circle cx={cx} cy={cy} r={3} fill={strokeColor} />

                {/* Node Label Box */}
                <g transform={`translate(${cx}, ${cy + 24})`}>
                  <text
                    textAnchor="middle"
                    className="font-display font-semibold text-[10.5px]"
                    fill={isDark ? '#F1F5F9' : '#0F172A'}
                  >
                    {node.label}
                  </text>
                  <text
                    y={13}
                    textAnchor="middle"
                    className="font-mono-tech text-[8.5px]"
                    fill={isDark ? '#94A3B8' : '#64748B'}
                  >
                    {node.sublabel}
                  </text>
                </g>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Interactive Inspection Footer */}
      <div
        className={`relative z-10 pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech ${
          isDark ? 'border-white/10 text-slate-400' : 'border-slate-200/70 text-slate-600'
        }`}
      >
        <div>
          {hoveredNode ? (
            <span>
              Inspecting:{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>
                {getNode(hoveredNode).label}
              </strong>{' '}
              · {getNode(hoveredNode).tier}
            </span>
          ) : (
            <span>Hover any architecture node to inspect data flow &amp; subnet tier</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={isDark ? 'text-cyan-400' : 'text-cyan-700'}>IaC: Terraform</span>
          <span>·</span>
          <span className={isDark ? 'text-violet-400' : 'text-violet-700'}>Orchestration: EKS</span>
        </div>
      </div>
    </div>
  );
};
