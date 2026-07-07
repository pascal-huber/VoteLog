# Certs generated with

    mkdir -p dex/certs
    openssl req -x509 -newkey rsa:2048 -nodes \
        -keyout dex/certs/dex.key -out dex/certs/dex.crt \
        -days 3650 -subj "/CN=dex"
    chmod o+r dex/certs/*