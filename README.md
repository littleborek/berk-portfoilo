# 🚀 Berk - Cloud & DevOps Portfolio

This project is a modern, high-performance digital portfolio designed to showcase engineering skills alongside aesthetics. It moves beyond static web development by integrating **Continuous Integration (CI)**, **automated performance optimization**, and a **Cloudflare Pages deployment pipeline**.

## 🔗 Live Preview

[![Visit Live Site](https://img.shields.io/badge/-Visit%20Live%20Site-1abc9c?style=for-the-badge&logo=cloudflare&logoColor=black)](https://berkk.cloud/)

---

## 🛠️ Technical Stack & Implementation

| Component | Technologies | Focus |
| :--- | :--- | :--- |
| **Front-end** | HTML5, Modern JavaScript, Tailwind CSS | Aesthetic, mobile-first design. |
| **Animation** | three.js, Custom JS Parallax | Dynamic 3D starfield background and mouse interaction. |
| **Data & Auth** | GitHub API (Projects), Formspree , i18n | Dynamic content loading and functioning contact channel. |
| **CI/CD** | **GitHub Actions**, Node.js, ESLint, Stylelint | Fully automated quality control and deployment. |

## ⚙️ Optimization and CI/CD Pipeline

The core value of this repository lies in its CI/CD process, which runs on every push:

1.  **Code Validation (CI):**
    * ESLint (JS) and Stylelint (CSS) check code against professional standards.
    * HTMLHint verifies structural integrity.
2.  **Asset Optimization (Build):**
    * **Tailwind Compilation:** The build script uses the Tailwind CLI to compile, purge, and minify CSS, eliminating the slow CDN dependency and drastically reducing CSS file size.
    * **Image Optimization:** The **`sharp`** Node.js library automatically compresses the `profile.jpg` asset, ensuring fast load times (critical for Lighthouse scores).

## 🌐 Hybrid Deployment Architecture

The infrastructure of this portfolio project follows a cost-effective and highly available hybrid deployment strategy:

### 1. Production Environment (Live)
- **Hosting:** Served on **Cloudflare Pages** at zero financial cost.
- **Benefits:** Global Edge CDN caching, SSL/TLS termination, automatic DDoS protection, and high-availability (HA).

### 2. Staging / Lab Environment (Local)
- **Virtualization:** Run locally on **OrbStack** (macOS).
- **Cluster:** A local lightweight **Kubernetes (K3s)** cluster.
- **GitOps Continuous Delivery:** Powered by **ArgoCD**. It tracks the [k8s/](file:///Users/berk/Projects/berk-portfoilo/k8s/) directory in this repository and automatically synchronizes updates to the cluster (**Self-Healing**).
- **Monitoring & Observability:** Configured with **Prometheus**, **Loki**, and **Grafana** for metrics and log aggregation.

---


## 📸 Project Screenshot

<img width="2560" height="5072" alt="Screenshot 2025-11-15 at 23-49-07 Berk Kocabörek - Kişisel Portföy" src="https://github.com/user-attachments/assets/264ed587-5e66-4606-8071-08e7a356502f" />



***

*This project serves as a practical demonstration of Cloud and DevOps engineering competencies.*

---

# 🇹🇷 Türkçe Versiyon (Ek Bilgi)

Bu versiyon, yukarıdaki içeriğin çevirisidir:

```markdown
# 🚀 Berk - Cloud & DevOps Portföy Sitesi

Bu proje, modern web geliştirme ve DevOps pratiklerini birleştiren kişisel bir portföydür. Sürekli Entegrasyon (CI), otomatik performans optimizasyonu ve Cloudflare Pages dağıtım hattı entegrasyonu ile teknik yeteneklerimi sergilemektedir.

## 🔗 Canlı Önizleme

https://berkk.cloud/

## 🛠️ Teknik Özellikler

- **CI/CD Pipeline:** GitHub Actions ile tam otomasyon (CI - ESLint/Stylelint & CD - Cloudflare Pages).
- **Performans Optimizasyonu:** Tailwind CDN yerine CLI ile derlenmiş ve optimize edilmiş CSS. **Sharp** kütüphanesi ile otomatik görsel sıkıştırma.
- **Dinamizm:** three.js 3D yıldız alanı, mouse parallax ve başlıklar için "Hacker" metin çözülme efekti.
- **Veri Entegrasyonu:** GitHub API'den canlı proje ve istatistik çekme.

## 🌐 Hibrit Altyapı Mimarisi

Bu projenin altyapısı, maliyet ve performans açısından optimize edilmiş bir hibrit dağıtım (hybrid deployment) mimarisine sahiptir:

### 1. Production (Canlı Ortam)
- **Barındırma:** Canlı trafik, sıfır finansal maliyetle **Cloudflare Pages** üzerinde sunulmaktadır.
- **Avantajlar:** Küresel Edge CDN, SSL/TLS, DDoS koruması ve yüksek erişilebilirlik (High-Availability).

### 2. Staging / Lab (Geliştirme Ortamı)
- **Sanallaştırma:** **OrbStack** üzerinde yerel olarak çalıştırılır.
- **Cluster:** Yerel hafif **Kubernetes (K3s)** cluster'ı.
- **GitOps CD:** **ArgoCD** vasıtasıyla [k8s/](file:///Users/berk/Projects/berk-portfoilo/k8s/) klasöründeki değişiklikler otomatik olarak dağıtılır (**Self-Healing**).
- **İzleme & Takip:** Metrik ve log takibi için **Prometheus**, **Loki** ve **Grafana** entegrasyonu mevcuttur.

---

*Bu proje, Cloud ve DevOps mühendisliği yetkinliklerini göstermek amacıyla geliştirilmiştir.*
```
