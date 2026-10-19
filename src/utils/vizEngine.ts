import { ProjectItem } from '../data/portfolioData';

export interface VizOutput {
  base: string;
  card: string;
  init?: (stage: HTMLElement) => void;
}

const isReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function pk(pathId: string, dur: number, begin?: number, cls?: string): string {
  if (isReducedMotion()) return '';
  return `<circle r="2.6" class="pk ${cls || ''}"><animateMotion dur="${dur}s" begin="${
    begin || 0
  }s" repeatCount="indefinite" rotate="auto"><mpath href="#${pathId}"/></animateMotion></circle>`;
}

function box(
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  sub?: string,
  cls?: string,
  tip?: string
): string {
  return `<g class="node pop" ${tip ? `data-tip="${tip}"` : ''}>
      <rect class="box ${cls || ''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>
      <text x="${x + 10}" y="${y + (sub ? h / 2 - 2 : h / 2 + 3.5)}">${label}</text>
      ${sub ? `<text class="lbl" x="${x + 10}" y="${y + h / 2 + 11}">${sub}</text>` : ''}
    </g>`;
}

const bar = (title: string, sample?: string) =>
  `<div class="layer-bar"><span class="tl"><i></i><i></i><i></i></span><span>${title}</span>${
    sample ? `<span class="sample">${sample}</span>` : ''
  }</div>`;

export function buildHeroNetworkSvg(): string {
  const RM = isReducedMotion();
  const W = 1000;
  const H = 900;
  const nodes: { id: string; x: number; y: number; t: string; big?: number }[] = [
    { id: 'r53', x: 620, y: 150, t: 'ROUTE 53' },
    { id: 'cf', x: 820, y: 230, t: 'CLOUDFRONT' },
    { id: 'alb', x: 560, y: 330, t: 'ALB' },
    { id: 'eks', x: 760, y: 420, t: 'EKS', big: 1 },
    { id: 'ec2', x: 420, y: 470, t: 'EC2 · ASG' },
    { id: 'rds', x: 600, y: 600, t: 'RDS' },
    { id: 's3', x: 880, y: 600, t: 'S3' },
    { id: 'cw', x: 360, y: 700, t: 'CLOUDWATCH' },
    { id: 'prom', x: 760, y: 760, t: 'PROMETHEUS' },
    { id: 'iam', x: 920, y: 400, t: 'IAM' },
    { id: 'ecr', x: 900, y: 120, t: 'ECR' },
    { id: 'tf', x: 300, y: 300, t: 'TERRAFORM' },
  ];
  const edges: [string, string][] = [
    ['r53', 'alb'],
    ['cf', 'alb'],
    ['r53', 'cf'],
    ['alb', 'eks'],
    ['alb', 'ec2'],
    ['eks', 'rds'],
    ['ec2', 'rds'],
    ['eks', 's3'],
    ['eks', 'iam'],
    ['ecr', 'eks'],
    ['ec2', 'cw'],
    ['eks', 'prom'],
    ['rds', 'prom'],
    ['tf', 'ec2'],
    ['tf', 'alb'],
    ['s3', 'prom'],
    ['cf', 'ecr'],
  ];
  const N = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const farParticles = [
    { cx: 240, cy: 180, r: 18, c: 'var(--cyan)', o: 0.08 },
    { cx: 480, cy: 120, r: 26, c: 'var(--violet)', o: 0.07 },
    { cx: 860, cy: 170, r: 32, c: 'var(--cyan)', o: 0.09 },
    { cx: 340, cy: 520, r: 24, c: 'var(--violet)', o: 0.07 },
    { cx: 680, cy: 310, r: 36, c: 'var(--cyan)', o: 0.08 },
    { cx: 910, cy: 510, r: 28, c: 'var(--violet)', o: 0.08 },
    { cx: 520, cy: 760, r: 22, c: 'var(--cyan)', o: 0.07 },
  ];
  const nearParticles = [
    { cx: 310, cy: 240, r: 3.5, c: 'var(--cyan)', o: 0.42 },
    { cx: 460, cy: 210, r: 2.5, c: 'var(--violet)', o: 0.38 },
    { cx: 690, cy: 190, r: 4, c: 'var(--cyan)', o: 0.45 },
    { cx: 830, cy: 320, r: 3, c: 'var(--violet)', o: 0.4 },
    { cx: 520, cy: 420, r: 2.8, c: 'var(--cyan)', o: 0.36 },
    { cx: 660, cy: 510, r: 3.8, c: 'var(--violet)', o: 0.44 },
    { cx: 840, cy: 680, r: 3.2, c: 'var(--cyan)', o: 0.4 },
    { cx: 430, cy: 630, r: 2.4, c: 'var(--violet)', o: 0.35 },
    { cx: 740, cy: 290, r: 2.2, c: 'var(--cyan)', o: 0.5 },
  ];
  let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMid slice">
    <defs>
      <filter id="dofFarBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
      <filter id="dofNearBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
    </defs>
    <g id="heroParticlesFar" filter="url(#dofFarBlur)">`;
  farParticles.forEach((p) => {
    s += `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.c}" opacity="${p.o}"/>`;
  });
  s += `</g><g id="heroParticlesNear" filter="url(#dofNearBlur)">`;
  nearParticles.forEach((p) => {
    s += `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${p.c}" opacity="${p.o}"/>`;
  });
  s += `</g><g id="netG">`;
  s += `<circle cx="760" cy="420" r="150" fill="none" stroke="currentColor" stroke-opacity=".05"/>`;
  s += `<circle cx="760" cy="420" r="300" fill="none" stroke="currentColor" stroke-opacity=".04" stroke-dasharray="2 6"/>`;
  edges.forEach(([a, b], i) => {
    const A = N[a];
    const B = N[b];
    const mx = (A.x + B.x) / 2 + (i % 2 ? 30 : -30);
    const my = (A.y + B.y) / 2 + (i % 3 ? -20 : 20);
    s += `<path id="ne${i}" class="net-line" d="M${A.x},${A.y} Q${mx},${my} ${B.x},${B.y}" style="transition-delay:${
      300 + i * 70
    }ms"/>`;
  });
  if (!RM) {
    [0, 3, 5, 7, 11, 12, 15].forEach((i, k) => {
      s += `<circle r="2.4" class="pkt ${k % 2 ? 'v' : ''}" opacity=".9"><animateMotion dur="${
        5 + (k % 3) * 1.6
      }s" begin="${2 + k * 0.7}s" repeatCount="indefinite"><mpath href="#ne${i}"/></animateMotion></circle>`;
    });
  }
  nodes.forEach((n, i) => {
    const r = n.big ? 9 : 5;
    s += `<g class="net-node" style="transition-delay:${500 + i * 90}ms" transform="translate(${
      n.x
    },${n.y})">
        ${
          n.big
            ? `<circle class="halo" r="22"><animate attributeName="r" values="16;30;16" dur="5s" repeatCount="indefinite"/><animate attributeName="stroke-opacity" values=".5;0;.5" dur="5s" repeatCount="indefinite"/></circle>`
            : ''
        }
        <circle class="core" r="${r}" stroke-width="1"/>
        <circle r="${n.big ? 3 : 1.6}" fill="${i % 3 === 0 ? 'var(--violet)' : 'var(--cyan)'}"/>
        <text x="${r + 10}" y="4">${n.t}</text>
      </g>`;
  });
  s += `</g></svg>`;
  return s;
}

function vizMultiTier(): VizOutput {
  const base = `<svg class="dg" viewBox="0 0 700 440">
      <rect class="zone-s" x="20" y="20" width="660" height="400" rx="12"/>
      <text class="lbl" x="36" y="42">VPC · 10.0.0.0/16</text>
      ${box(290, 54, 120, 34, 'Internet GW', '', '', 'Internet Gateway — public ingress')}
      ${['AZ-a', 'AZ-b']
        .map((az, k) => {
          const x = 40 + k * 320;
          return `<rect class="zone" x="${x}" y="104" width="300" height="300" rx="10"/>
          <text class="lbl" x="${x + 14}" y="124">${az.toUpperCase()}</text>
          <text class="lbl" x="${x + 14}" y="148">PUBLIC SUBNET</text>
          ${box(
            x + 14,
            156,
            130,
            34,
            'ALB node',
            '',
            'c',
            'Application Load Balancer · health-checked target groups'
          )}
          ${box(x + 156, 156, 130, 34, 'NAT GW', '', '', 'NAT Gateway for private egress')}
          <text class="lbl" x="${x + 14}" y="218">PRIVATE APP SUBNET · ASG</text>
          ${[0, 1, 2]
            .map((i) =>
              box(
                x + 14 + i * 92,
                226,
                82,
                40,
                'EC2',
                'app',
                '',
                'Launch Template → Auto Scaling Group'
              )
            )
            .join('')}
          <text class="lbl" x="${x + 14}" y="298">DB SUBNET</text>
          ${box(
            x + 14,
            306,
            272,
            40,
            'RDS PostgreSQL',
            k ? 'standby · multi-az' : 'primary · kms',
            k ? '' : 'v',
            'Multi-AZ RDS · automated snapshots · KMS at rest'
          )}
          <text class="lbl" x="${x + 14}" y="384">SG · least-privilege</text>`;
        })
        .join('')}
      <path id="mt1" class="wire" d="M350,88 L350,100 L110,100 L110,156"/>
      <path id="mt2" class="wire" d="M350,100 L430,100 L430,156"/>
      <path id="mt3" class="wire" d="M110,190 L110,226"/>
      <path id="mt4" class="wire" d="M430,190 L430,226"/>
      <path id="mt5" class="wire" d="M150,266 L150,306"/>
      <path id="mt6" class="wire" d="M470,266 L470,306"/>
      <path class="wire dash" d="M286,326 L374,326" style="--len:88"/>
      <text class="lbl" x="296" y="318">SYNC</text>
      ${pk('mt1', 3.2)}${pk('mt2', 3.2, 1.6, 'v')}${pk('mt3', 2, 0.4)}${pk('mt4', 2, 1.4)}${pk(
    'mt5',
    2.4,
    0.8,
    'v'
  )}${pk('mt6', 2.4, 1.8, 'v')}
    </svg>`;
  const card = `<pre class="code">${[
    `<span class="c"># modules/network/main.tf</span>`,
    `<span class="k">module</span> <span class="s">"vpc"</span> {`,
    `  source   = <span class="s">"./modules/vpc"</span>`,
    `  cidr     = <span class="s">"10.0.0.0/16"</span>`,
    `  azs      = [<span class="s">"a"</span>, <span class="s">"b"</span>]`,
    `}`,
    `<span class="k">module</span> <span class="s">"app_asg"</span> {`,
    `  min_size = <span class="y">2</span>`,
    `  max_size = <span class="y">6</span>`,
    `}`,
    `<span class="g">Apply complete!</span> <span class="c">(sample)</span>`,
  ]
    .map((l, i) => `<span class="ln" style="transition-delay:${400 + i * 90}ms">${l}</span>`)
    .join('')}</pre>`;
  return { base: bar('architecture · 3-tier', 'ILLUSTRATIVE') + base, card: bar('terraform plan') + card };
}

function vizEKS(): VizOutput {
  const RM = isReducedMotion();
  const pods = (x: number, y: number, n: number, scaleFrom: number) =>
    Array.from({ length: n }, (_, i) => {
      return `<rect class="pod ${i >= scaleFrom ? 'scale' : ''}" x="${x + (i % 4) * 30}" y="${
        y + Math.floor(i / 4) * 26
      }" width="22" height="18" rx="4" style="animation-delay:${(i - scaleFrom) * 0.25}s"/>`;
    }).join('');
  const base = `<svg class="dg" viewBox="0 0 700 440">
      ${box(30, 40, 120, 40, 'Docker build', 'multi-stage', '', 'Multi-stage Docker builds · minimal images')}
      ${box(30, 120, 120, 40, 'Amazon ECR', 'registry', 'v', 'Images published to Amazon ECR')}
      ${box(
        30,
        200,
        120,
        40,
        'Helm chart',
        'deploy · svc · ing',
        '',
        'Deployments, Services, ConfigMaps, Secrets, Ingress'
      )}
      <path id="ek1" class="wire" d="M90,80 L90,120"/>
      <path id="ek2" class="wire" d="M90,160 L90,200"/>
      <path id="ek3" class="wire" d="M150,220 L200,220"/>
      <rect class="zone-s" x="200" y="30" width="470" height="390" rx="12"/>
      <text class="lbl" x="216" y="52">AMAZON EKS CLUSTER</text>
      ${box(216, 64, 200, 40, 'Control plane', 'managed', 'c', 'Amazon EKS managed control plane')}
      ${box(430, 64, 110, 40, 'CoreDNS', '', '', 'Cluster DNS')}
      ${box(552, 64, 104, 40, 'IRSA', 'pod → IAM', 'v', 'IAM Roles for Service Accounts')}
      ${[0, 1]
        .map((k) => {
          const x = 216 + k * 228;
          return `<rect class="zone" x="${x}" y="124" width="212" height="210" rx="10"/>
          <text class="lbl" x="${x + 12}" y="144">NODE GROUP · EC2-${k + 1}</text>
          ${pods(x + 22, 160, 12, k ? 5 : 6)}
          <text class="lbl" x="${x + 12}" y="320">liveness ✓ readiness ✓</text>`;
        })
        .join('')}
      <rect class="box c" x="216" y="350" width="440" height="52" rx="8"/>
      <text x="230" y="372">HPA · Horizontal Pod Autoscaler</text>
      <text class="lbl" x="230" y="388">target cpu 70% · mem 80%  —  sample thresholds</text>
      <rect x="500" y="368" width="140" height="6" rx="3" fill="rgba(255,255,255,.08)"/>
      <rect x="500" y="368" width="140" height="6" rx="3" fill="var(--cyan)" style="transform-origin:500px 371px;${
        RM ? '' : 'animation:hpa 6s var(--ease) infinite'
      }"/>
      ${pk('ek1', 1.8)}${pk('ek2', 1.8, 0.6, 'v')}${pk('ek3', 1.4, 1.2)}
    </svg><style>@keyframes hpa{0%,15%{transform:scaleX(.35)}35%,70%{transform:scaleX(.82)}90%,100%{transform:scaleX(.35)}}</style>`;
  const card = `<pre class="code">${[
    `<span class="c">$ kubectl get hpa</span>`,
    `NAME   REF          TARGETS  PODS`,
    `api    deploy/api   <span class="s">64%/70%</span>  <span class="y">6</span>`,
    `web    deploy/web   <span class="s">41%/70%</span>  <span class="y">4</span>`,
    ``,
    `<span class="c">$ kubectl rollout status deploy/api</span>`,
    `<span class="g">deployment "api" successfully rolled out</span>`,
    `<span class="c"># sample output</span>`,
  ]
    .map(
      (l, i) => `<span class="ln" style="transition-delay:${400 + i * 90}ms">${l || '&nbsp;'}</span>`
    )
    .join('')}</pre>`;
  return { base: bar('eks · orchestration', 'ILLUSTRATIVE') + base, card: bar('kubectl') + card };
}

function initCICD(stage: HTMLElement) {
  const RM = isReducedMotion();
  const stgs = [...stage.querySelectorAll('.stg')];
  const status = stage.querySelector('#cicdStatus');
  let i = -1;
  let timer: ReturnType<typeof setInterval> | null = null;
  const tick = () => {
    i = (i + 1) % (stgs.length + 2);
    stgs.forEach((g, k) =>
      g.classList.toggle('lit', k <= i && i < stgs.length + 1 && k < Math.min(i + 1, stgs.length))
    );
    if (status) {
      status.textContent =
        i < stgs.length ? `running · stage ${i + 1}/${stgs.length}` : '✓ deployed · weekly → daily';
    }
  };
  if (RM) {
    stgs.forEach((g) => g.classList.add('lit'));
    if (status) status.textContent = '✓ deployed · weekly → daily';
    return;
  }
  (stage as any)._play = () => {
    if (!timer) timer = setInterval(tick, 900);
  };
  (stage as any)._pause = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
}

function vizCICD(): VizOutput {
  const stages = [
    ['PR / merge', 'trigger'],
    ['Lint + Test', 'unit'],
    ['Trivy scan', 'image vulns'],
    ['Docker build', 'semver tag'],
    ['Push → ECR', 'OIDC auth'],
    ['Helm upgrade', 'rolling'],
    ['Health check', 'auto-rollback'],
  ];
  let s = `<svg class="dg" viewBox="0 0 700 440"><text class="lbl" x="30" y="40">GITHUB ACTIONS · WORKFLOW RUN #— (SIMULATED)</text>`;
  const pos = stages.map((_, i) =>
    i < 4 ? { x: 30 + i * 165, y: 80 } : { x: 30 + (6 - i) * 165 + 165, y: 230 }
  );
  pos[6] = { x: 195, y: 230 };
  pos[5] = { x: 360, y: 230 };
  pos[4] = { x: 525, y: 230 };
  stages.forEach((st, i) => {
    const p = pos[i];
    s += `<g class="node stg pop" data-stage="${i}" data-tip="${st[0]} — ${st[1]}">
        <rect class="box" x="${p.x}" y="${p.y}" width="140" height="64" rx="8"/>
        <text class="lbl" x="${p.x + 12}" y="${p.y + 20}">STAGE ${String(i + 1).padStart(
      2,
      '0'
    )}</text>
        <text x="${p.x + 12}" y="${p.y + 38}">${st[0]}</text>
        <text class="lbl" x="${p.x + 12}" y="${p.y + 54}">${st[1]}</text>
        <circle class="tick" cx="${p.x + 124}" cy="${p.y + 16}" r="4"/>
      </g>`;
  });
  s += `<path id="cp" class="wire" d="M170,112 L195,112 M335,112 L360,112 M500,112 L525,112 M665,112 L680,112 L680,262 L665,262 M525,262 L500,262 M360,262 L335,262"/>`;
  s += `<path id="cpm" fill="none" stroke="none" d="M100,112 L595,112 L680,112 L680,262 L265,262"/>`;
  s += pk('cpm', 7);
  s += `<rect class="zone" x="30" y="340" width="640" height="70" rx="10"/>
      <text class="lbl" x="46" y="362">SECRETS</text><text x="46" y="384">GitHub Encrypted Secrets · OIDC · least-privilege IAM</text>
      <text class="lbl" x="480" y="362">CADENCE</text><text x="480" y="384" id="cicdStatus">idle</text>
    </svg>`;
  const card = `<pre class="code">${[
    `<span class="c"># .github/workflows/deploy.yml</span>`,
    `<span class="k">on</span>: [pull_request, push]`,
    `<span class="k">jobs</span>:`,
    `  build:`,
    `    steps:`,
    `      - run: <span class="s">trivy image $IMG</span>`,
    `      - run: <span class="s">docker push $ECR</span>`,
    `      - run: <span class="s">helm upgrade --atomic</span>`,
    `<span class="c"># abridged sample</span>`,
  ]
    .map((l, i) => `<span class="ln" style="transition-delay:${400 + i * 90}ms">${l}</span>`)
    .join('')}</pre>`;
  return { base: bar('ci/cd · pipeline', 'SIMULATED RUN') + s, card: bar('workflow.yml') + card, init: initCICD };
}

function initState(stage: HTMLElement) {
  const RM = isReducedMotion();
  const lb = stage.querySelector('#lockBox');
  const lt = stage.querySelector('#lockTxt');
  const envs = ['dev', 'staging', 'prod'];
  let k = 0;
  let on = false;
  let timer: ReturnType<typeof setInterval> | null = null;
  const tick = () => {
    on = !on;
    if (lb) lb.classList.toggle('on', on);
    if (lt) {
      lt.textContent = on
        ? `LockID — held by ${envs[(k = (k + 1) % 3)]} apply`
        : 'LockID — free';
    }
  };
  if (RM) return;
  (stage as any)._play = () => {
    if (!timer) timer = setInterval(tick, 1800);
  };
  (stage as any)._pause = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
}

function vizState(): VizOutput {
  const envs = ['dev', 'staging', 'prod'];
  let s = `<svg class="dg" viewBox="0 0 700 440">
      <text class="lbl" x="30" y="40">TERRAFORM WORKSPACES</text>`;
  envs.forEach((e, i) => {
    s += box(
      30,
      60 + i * 74,
      150,
      52,
      `workspace: ${e}`,
      `${e}.tfvars`,
      i === 2 ? 'v' : '',
      `Isolated ${e} workspace with environment-specific .tfvars`
    );
    s += `<path id="st${i}" class="wire" d="M180,${86 + i * 74} C260,${86 + i * 74} 260,200 330,200"/>`;
  });
  s += `<rect class="zone-s" x="330" y="60" width="340" height="280" rx="12"/>
      <text class="lbl" x="346" y="82">REMOTE BACKEND</text>
      ${box(
        346,
        96,
        308,
        64,
        'Amazon S3 · state bucket',
        'versioning · SSE-KMS · public access blocked',
        'c',
        'S3 remote state with versioning + KMS encryption'
      )}
      <g class="node pop" data-tip="DynamoDB lock table prevents concurrent applies">
        <rect class="box lock" id="lockBox" x="346" y="176" width="308" height="64" rx="6"/>
        <text x="356" y="202">DynamoDB · state lock</text>
        <text class="lbl" x="356" y="219" id="lockTxt">LockID — free</text>
      </g>
      ${box(346, 256, 148, 64, 'AWS KMS', 'cmk', 'v', 'Encryption key for state objects')}
      ${box(
        506,
        256,
        148,
        64,
        'IAM policy',
        'automation roles',
        '',
        'Strict bucket policy — only authorised roles'
      )}
      <rect class="zone" x="30" y="364" width="640" height="52" rx="10"/>
      <text x="46" y="395">fmt ✓   validate ✓   drift detection ✓</text>
      <text class="lbl" x="520" y="395">AUTOMATED CHECKS</text>
      ${pk('st0', 2.6)}${pk('st1', 2.6, 0.9, 'v')}${pk('st2', 2.6, 1.8)}
    </svg>`;
  const card = `<pre class="code">${[
    `<span class="k">terraform</span> {`,
    `  <span class="k">backend</span> <span class="s">"s3"</span> {`,
    `    bucket         = <span class="s">"tf-state"</span>`,
    `    key            = <span class="s">"env/terraform.tfstate"</span>`,
    `    encrypt        = <span class="y">true</span>`,
    `    kms_key_id     = <span class="s">"alias/tf"</span>`,
    `    dynamodb_table = <span class="s">"tf-lock"</span>`,
    `  }`,
    `}`,
  ]
    .map((l, i) => `<span class="ln" style="transition-delay:${400 + i * 90}ms">${l}</span>`)
    .join('')}</pre>`;
  return { base: bar('iac · remote state', 'ILLUSTRATIVE') + s, card: bar('backend.tf') + card, init: initState };
}

function series(n: number, seed: number, lo: number, hi: number): number[] {
  let v = (lo + hi) / 2;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    v +=
      Math.sin(i * 0.7 + seed) * (hi - lo) * 0.12 +
      Math.cos(i * 0.31 + seed * 2) * (hi - lo) * 0.06;
    v = Math.max(lo, Math.min(hi, v));
    out.push(v);
  }
  return out;
}

function spark(vals: number[], w: number, h: number, color: string, max?: number): string {
  const m = max || Math.max(...vals);
  const pts = vals
    .map((v, i) => `${(i / (vals.length - 1)) * w},${h - (v / m) * h * 0.9}`)
    .join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline class="spark" points="${pts}" stroke="${color}" vector-effect="non-scaling-stroke"/></svg>`;
}

function vizObs(): VizOutput {
  const cpu = series(40, 1, 20, 90);
  const mem = series(40, 3, 30, 80);
  const net = series(40, 5, 10, 100);
  const bars = Array.from({ length: 14 }, (_, i) => 20 + ((i * 37) % 70));
  const base = `<div class="dash">
      <div class="pnl"><h5>Node up</h5><div class="v">12<small>/12</small></div></div>
      <div class="pnl"><h5>Pod restarts · 1h</h5><div class="v">3</div></div>
      <div class="pnl hide-xs"><h5>p95 latency</h5><div class="v">184<small>ms</small></div></div>
      <div class="pnl hide-xs"><h5>Firing alerts</h5><div class="v" style="color:var(--warn)">1</div></div>
      <div class="pnl w2"><h5>CPU utilisation · node_exporter</h5>${spark(
        cpu,
        300,
        80,
        'var(--cyan)',
        100
      )}</div>
      <div class="pnl w2"><h5>Memory · node_exporter</h5>${spark(
        mem,
        300,
        80,
        'var(--violet)',
        100
      )}</div>
      <div class="pnl w2"><h5>Network throughput</h5>${spark(net, 300, 80, 'var(--ok)', 100)}</div>
      <div class="pnl w2"><h5>Requests by status</h5><svg class="bars" viewBox="0 0 280 80" preserveAspectRatio="none">${bars
        .map(
          (b, i) =>
            `<rect x="${i * 20 + 2}" y="${80 - b}" width="13" height="${b}" rx="2" fill="${
              i === 9 ? 'var(--warn)' : 'rgba(236,234,228,.28)'
            }" style="transition-delay:${i * 50}ms"/>`
        )
        .join('')}</svg></div>
    </div>`;
  const card = `<div style="padding:12px 14px">
      <div class="mono" style="font-size:9px;color:var(--moon-3);margin-bottom:8px">PROMQL RULE</div>
      <div class="code" style="padding:0;white-space:normal;font-size:10.5px;line-height:1.6;margin-bottom:12px"><span class="ln">avg by(instance)(rate(node_cpu_seconds_total{mode!="idle"}[5m])) <span class="y">&gt; 0.85</span></span></div>
      <div class="mono" style="font-size:9px;color:var(--moon-3);margin-bottom:4px">ALERTMANAGER → ROUTES</div>
      <div class="alert-row"><i style="background:var(--warn)"></i>HighCPU · warning → #slack</div>
      <div class="alert-row"><i style="background:var(--ok)"></i>DiskSpace · resolved</div>
      <div class="alert-row"><i style="background:var(--cyan)"></i>ServiceDown · → email</div>
    </div>`;
  return {
    base: bar('grafana · cluster health', 'SAMPLE DATA') + base,
    card: bar('prometheus · alerts', 'SAMPLE') + card,
  };
}

const builders = [vizMultiTier, vizEKS, vizCICD, vizState, vizObs];

export function forProject(p: ProjectItem, i: number): VizOutput {
  const t = (p.title + ' ' + p.category).toLowerCase();
  if (t.includes('multi-tier')) return vizMultiTier();
  if (t.includes('eks') || t.includes('kubernetes')) return vizEKS();
  if (t.includes('ci/cd') || t.includes('actions')) return vizCICD();
  if (t.includes('remote state')) return vizState();
  if (t.includes('observab') || t.includes('prometheus')) return vizObs();
  return builders[i % builders.length]();
}
