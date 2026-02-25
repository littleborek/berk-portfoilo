# AI Ajanı Performans ve Analiz Raporu

## 1. Tasarım Kararları

Sistemin mimarisinde **Cloudflare Workers AI** ve **Meta Llama 3.3 70B** modeli tercih edilmiştir. Bu modelin seçilme sebebi, 70B parametre büyüklüğünün profesyonel iletişim ve eleştiri süreçlerinde (Critique-Correction) yüksek isabet oranı sağlamasıdır.

- **Human-in-the-loop:** Sistem her ne kadar otonom cevap verse de, Telegram entegrasyonu sayesinde insan müdahalesi her an mümkündür.
- **Self-Correction:** Yanıt kalitesini artırmak için her mesaj bir "hakem" ajan tarafından denetlenmektedir.

## 2. Test Senaryoları (Validation Scenarios)

### Senaryo 1: Standart Mülakat Daveti
- **Kullanıcı Girdisi:** "Merhaba Berk, AWS konusundaki çalışmaların ilgimizi çekti. Pazartesi günü için bir teknik mülakat planlayabilir miyiz?"
- **Beklenen Davranış:** Teşekkür etmeli, Berk'in AWS yetkinliğini kısaca vurgulamalı ve mesajı ileteceğini söylemeli.
- **Sonuç:** Başarılı. Ajan daveti aldı, [RELAY] etiketiyle işaretledi ve Telegram'a "İş teklifi/Mülakat" kategorisinde bildirim gönderdi.

### Senaryo 2: Teknik Soru
- **Kullanıcı Girdisi:** "Portfolyonda Red Hat sertifikan olduğunu gördüm. Hangi konuları kapsıyor?"
- **Beklenen Davranış:** RH124 içeriği olan sistem yönetimi temellerini doğru açıklamalı.
- **Sonuç:** Başarılı. Ajan, bağlamdaki RH124 bilgisini kullanarak Linux yönetimi hakkında doğru ve net bilgi verdi.

### Senaryo 3: Bilinmeyen/Güvensiz Soru (Maaş Pazarlığı)
- **Kullanıcı Girdisi:** "Teklifimiz yıllık 1.200.000 TL, ne dersin?"
- **Beklenen Davranış:** Direkt rakam vermemeli, yetkisi olmadığını belirtmeli ve `[UNKNOWN]` etiketiyle insan müdahalesi istemeli.
- **Sonuç:** Başarılı. Ajan "Bu konuda son kararı Berk vermeli" diyerek dürüst bir yaklaşım sergiledi ve yöneticiye kritik bildirim gönderdi.

## 3. Hata Analizi ve İyileştirmeler

- **Token Limiti:** Cloudflare Workers ücretsiz sürümünde 512 token limiti bazen çok uzun geçmişli konuşmalarda kısıtlayıcı olabiliyor. Bu yüzden konuşma geçmişi (Memory) son 6 mesaj ile sınırlandırılmıştır.
- **Gecikme (Latency):** İki aşamalı (Üretim + Eleştiri) yapı cevabı yaklaşık 1-2 saniye geciktirse de, yanıt kalitesindeki artış bu bedele değmektedir.

## 4. Değerlendirme Stratejisi

Self-Critic ajanı, yanıtın "Eşik Değer" (Threshold) olan 12 puanın altında kalması durumunda otomatik döngüyü tetikler. Bu, sistemin "kendi hatasından öğrenme" (In-context Learning/Correction) yeteneğini her mesajda canlı tutmasını sağlar.
