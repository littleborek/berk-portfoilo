# Stage 1: Nginx web sunucusunu kullan
# alpine versiyonu, istendiği gibi küçük ve hafiftir.
FROM nginx:alpine

# Nginx'in HTML dosyalarını sunduğu varsayılan dizine geç
WORKDIR /usr/share/nginx/html

# Tek HTML dosyamızı bu dizine kopyala
COPY index.html .
COPY profile.jpg .

# Nginx varsayılan olarak 80 portunu dinler, bunu belirtelim.
EXPOSE 80