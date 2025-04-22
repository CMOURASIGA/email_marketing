# 📬 Sistema de Envio de Comunicados

Este projeto é um script em Google Apps Script para automação de envio de e-mails com comunicados .

## ✨ Funcionalidades

- Envio automático e personalizado de e-mails a partir de uma planilha de contatos
- Template visual institucional com identidade do EAC
- Rodapé com links para redes sociais (Instagram e Facebook)
- Controle de status de envio (`Pendente`, `Enviado`) e data
- Limite diário de envio configurável (100 por padrão)
- Modo de simulação para testes
- Menu e macro integrada para uso direto no Google Sheets

## 🧾 Estrutura da Planilha

### Aba `Comunicados`
Contém os conteúdos dos e-mails.

| ID | Título | Assunto do E-mail | Corpo HTML | Status | Data Agendada |

### Aba `Fila_Envio`
Contém os destinatários.

| Nome | E-mail | ID Comunicação | Status Envio | Data de Envio |

### Aba `Base_Contatos` (opcional)
Origem para preenchimento automatizado da `Fila_Envio`.

---

## 🛠️ Como usar

1. Abra o Google Sheets e vá em **Extensões > Apps Script**
2. Cole o conteúdo do arquivo `eac_comunicacao_script.gs`
3. Configure a ID da planilha no código (caso necessário)
4. Use a função `enviarEmailsFilaEnvioLimitado()` para rodar o envio
5. Use o menu personalizado para marcar registros como "Pendente"

---

## 📌 Sobre

Este projeto foi desenvolvido por Christian Moura com apoio do ChatGPT para facilitar a comunicação institucional do EAC Porciúncula.  
Redes sociais do projeto:

- 📸 Instagram: [name](link do instagram)
- 📘 Facebook: [name](link facebook)
