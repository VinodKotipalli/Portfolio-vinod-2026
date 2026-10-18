import { jsPDF } from 'jspdf';

export function createResumePdfDoc(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const margin = 36;
  const pageWidth = 612;
  const contentWidth = pageWidth - margin * 2;
  let y = 36;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 25, 35);
  doc.text('SAIVINOD KOTIPALLI', pageWidth / 2, y, { align: 'center' });
  y += 15;

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 50, 65);
  doc.text('AWS DevOps Engineer | Site Reliability & DevOps', pageWidth / 2, y, { align: 'center' });
  y += 13;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 75, 85);
  doc.text(
    'Srikakulam, Andhra Pradesh 532401 | +91 8520899337 | saivinodkotipalli2003@gmail.com',
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 14;

  const drawSectionHeader = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 2.5;
    doc.setDrawColor(20, 25, 35);
    doc.setLineWidth(0.75);
    doc.line(margin, y, pageWidth - margin, y);
    y += 9.5;
  };

  drawSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(30, 41, 59);
  const summaryLines = doc.splitTextToSize(
    'AWS DevOps Engineer with 2+ years of experience specializing in site reliability engineering (SRE), cloud monitoring, and infrastructure automation. Highly skilled in Infrastructure as Code (Terraform, CloudFormation), CI/CD pipelines (Jenkins, GitHub Actions), and centralized observability (Prometheus, Grafana). Proven ability to manage AWS environments, optimize performance using the AWS Well-Architected Framework, and reduce Mean Time to Detect (MTTD).',
    contentWidth
  );
  doc.text(summaryLines, margin, y, { lineHeightFactor: 1.14 });
  y += summaryLines.length * 9.5 + 5;

  drawSectionHeader('Technical Skills');
  const skillsList = [
    { cat: 'Languages', val: 'Python, Java, Bash, Shell Scripting' },
    { cat: 'AWS Compute & Storage', val: 'EC2, S3, Lambda, RDS, ECR, EKS, Auto Scaling, SNS, CloudWatch' },
    {
      cat: 'AWS Networking',
      val: 'VPC, Subnets, Route 53, ALB/NLB/CLB, NAT Gateway, Internet Gateway, VPC Peering, CloudFront, Direct Connect',
    },
    {
      cat: 'AWS Security',
      val: 'IAM, KMS, Secrets Manager, Security Groups, NACLs, WAF, Shield, GuardDuty, Security Hub, ACM, AWS Config, CloudTrail',
    },
    { cat: 'Containers & Orchestration', val: 'Docker, Kubernetes, Amazon EKS, Helm' },
    { cat: 'Infrastructure as Code', val: 'Terraform, AWS CloudFormation, Ansible' },
    {
      cat: 'Monitoring & Observability',
      val: 'CloudWatch, Prometheus, Grafana, Dynatrace, Node Exporter, Alertmanager, PromQL',
    },
    { cat: 'CI/CD & Version Control', val: 'Git, GitHub, GitLab, Jenkins, GitHub Actions, AWS CodePipeline' },
    { cat: 'Databases', val: 'MySQL, PostgreSQL' },
    { cat: 'Operating Systems', val: 'Linux, Ubuntu, Amazon Linux' },
    {
      cat: 'Methodologies',
      val: 'DevOps, IaC, GitOps, CI/CD Automation, SRE, Cloud Security, Disaster Recovery & Backup, AWS Well-Architected Framework, Technical Documentation & Runbooks',
    },
  ];

  skillsList.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(20, 25, 35);
    const label = `${item.cat}: `;
    const labelWidth = doc.getTextWidth(label);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 55, 72);
    const valLines = doc.splitTextToSize(item.val, contentWidth - labelWidth);
    doc.text(valLines[0], margin + labelWidth, y);
    if (valLines.length > 1) {
      for (let i = 1; i < valLines.length; i++) {
        y += 9.2;
        doc.text(valLines[i], margin + 12, y);
      }
    }
    y += 9.3;
  });

  y += 3.5;
  drawSectionHeader('Professional Experience');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(15, 23, 42);
  doc.text('AWS DevOps Engineer — Tata Consultancy Services (TCS), Hyderabad', margin, y);
  y += 9.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(60, 70, 85);
  doc.text('June 2024 – Present', margin, y);
  y += 9.5;

  const expBullets = [
    'Designed, deployed, and maintained a centralized Prometheus and Grafana monitoring platform, delivering real-time visibility into infrastructure health across multiple Linux servers and cloud environments.',
    'Automated provisioning of monitoring infrastructure using Terraform, enabling consistent, version-controlled, repeatable deployment of Prometheus, Grafana, and Node Exporter across environments.',
    'Integrated Jenkins CI/CD pipelines with the monitoring stack to validate post-deployment application health and trigger automated alerts on failed builds, accelerating release cycles from weekly to daily.',
    'Installed and configured Node Exporter on Linux servers to collect CPU, memory, disk, filesystem, network, and system load metrics; configured Prometheus scrape jobs, service discovery, recording rules, and alerting rules.',
    'Developed interactive Grafana dashboards using PromQL to visualize infrastructure performance, server availability, application health, and resource utilization.',
    'Integrated Alertmanager with email and Slack for automated alerting on CPU, memory, disk, and service downtime; tuned thresholds, grouping, and deduplication to reduce alert fatigue and improve incident response.',
    'Monitored AWS EC2 instances, Linux servers, and Docker containers to improve operational visibility and reliability; performed proactive capacity planning and troubleshot exporter, scrape, and connectivity issues.',
    'Applied AWS Well-Architected Framework best practices across Reliability, Security, Cost Optimization, Performance Efficiency, and Operational Excellence pillars in monitoring and infrastructure design.',
    'Authored technical documentation, dashboard guides, operational runbooks, and SOPs for monitoring, alerting, and incident response, improving knowledge transfer and reducing onboarding time.',
    'Collaborated with cross-functional DevOps, SRE, and application teams to implement monitoring standards and support incident management through faster root cause analysis and reduced MTTD.',
  ];

  expBullets.forEach((bullet) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.9);
    doc.setTextColor(30, 41, 59);
    doc.text('•', margin + 2, y);
    const lines = doc.splitTextToSize(bullet, contentWidth - 14);
    doc.text(lines, margin + 10, y, { lineHeightFactor: 1.12 });
    y += lines.length * 8.8 + 1.4;
  });

  y += 2.5;
  drawSectionHeader('Key Achievements');
  const achievementBullets = [
    'Reduced application release cycles from weekly to daily by standardizing CI/CD workflows and deployment automation.',
    'Accelerated infrastructure delivery with reusable Infrastructure as Code (IaC) templates, reducing provisioning time by 80%.',
    'Strengthened cloud governance and security through automated compliance controls, encryption, and least-privilege access — resulting in zero critical security findings.',
  ];

  achievementBullets.forEach((bullet) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.9);
    doc.setTextColor(30, 41, 59);
    doc.text('•', margin + 2, y);
    const lines = doc.splitTextToSize(bullet, contentWidth - 14);
    doc.text(lines, margin + 10, y, { lineHeightFactor: 1.12 });
    y += lines.length * 8.8 + 1.4;
  });

  y += 2.5;
  drawSectionHeader('Certifications');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('AWS Certified Solutions Architect – Associate (SAA-C03), Amazon Web Services, 2026', margin, y);
  y += 9.2;
  doc.text('AWS Certified Data Engineer – Associate (DEA-C01), Amazon Web Services, 2026', margin, y);
  y += 10.5;

  drawSectionHeader('Education');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(20, 25, 35);
  const degreeText = 'B.Sc. Computer Science';
  doc.text(degreeText, margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(45, 55, 72);
  doc.text(
    ' — Sri Aditya Degree College, Ambedkar University, Srikakulam, Andhra Pradesh',
    margin + doc.getTextWidth(degreeText),
    y
  );
  y += 9.2;
  doc.text('June 2020 – August 2023 | Percentage: 77.40%', margin, y);

  return doc;
}

export function downloadResumePdf(filename = 'Saivinod_Kotipalli_Resume.pdf'): void {
  createResumePdfDoc().save(filename);
}
