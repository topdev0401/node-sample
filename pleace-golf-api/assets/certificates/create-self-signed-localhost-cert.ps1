
# setup certificate properties including the commonName (DNSName) property for Chrome 58+
$certificate = New-SelfSignedCertificate `
    -Subject localhost `
    -DnsName localhost `
    -KeyAlgorithm RSA `
    -KeyLength 2048 `
    -NotBefore (Get-Date) `
    -NotAfter (Get-Date).AddYears(2) `
    -CertStoreLocation "cert:CurrentUser\My" `
    -FriendlyName "Localhost Certificate for Node.js" `
    -HashAlgorithm SHA256 `
    -KeyUsage DigitalSignature, KeyEncipherment, DataEncipherment `
    -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1") 
$certificatePath = 'Cert:\CurrentUser\My\' + ($certificate.ThumbPrint)  

# create temporary certificate path
$certsPath = "$pwd"

# set certificate password here
$pfxPasswordText = "password"
$pfxPassword = ConvertTo-SecureString -String $pfxPasswordText -Force -AsPlainText
$pfxFilePath = "$certsPath\localhost.pfx"
$cerFilePath = "$certsPath\localhost.cer"

# create pfx certificate
Export-PfxCertificate -Cert $certificatePath -FilePath $pfxFilePath -Password $pfxPassword
Export-Certificate -Cert $certificatePath -FilePath $cerFilePath


$pemKeyFilePath = "$certsPath\localhostkey.pem"
$keyFilePath = "$certsPath\localhost.key"
$certFilePath = "$certsPath\localhost.pem"


# NB: install Windows OpenSSL from
# https://slproweb.com/products/Win32OpenSSL.html


& "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" pkcs12 -in $pfxFilePath -nocerts -out $pemKeyFilePath -nodes -passin pass:$pfxPasswordText
& "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" pkcs12 -in $pfxFilePath -nokeys -out $certFilePath -passin pass:$pfxPasswordText
& "C:\Program Files\OpenSSL-Win64\bin\openssl.exe" rsa -in $pemKeyFilePath -out $keyFilePath


# delete files that are not needed
Remove-Item $pemKeyFilePath