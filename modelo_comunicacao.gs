// Arquivo: modelo_comunicacao_script.gs

/**
 * Função principal de envio de e-mails com controle de status e visual aprimorado
 */
function enviarEmailsFilaEnvioLimitado() {
  const LIMITE_DIARIO = 100;
  const MODO_SIMULACAO = true;
  const EMAIL_TESTE = "cmourasiga@gmail.com";

  let enviadosHoje = 0;

  const planilha = SpreadsheetApp.openById("1BXitZrMOxFasCJAqkxVVdkYPOLLUDEMQ2bIx5mrP8Y8");
  const abaFila = planilha.getSheetByName("Fila_Envio");
  const abaComunicados = planilha.getSheetByName("Comunicados");

  const dadosFila = abaFila.getRange(2, 1, abaFila.getLastRow() - 1, 5).getValues();
  const comunicados = abaComunicados.getRange(2, 1, abaComunicados.getLastRow() - 1, 6).getValues();

  for (let i = 0; i < dadosFila.length; i++) {
    if (enviadosHoje >= LIMITE_DIARIO) break;

    const [nome, emailOriginal, idComunicado, status, _] = dadosFila[i];
    const linhaPlanilha = i + 2;

    if (status !== "Pendente") continue;

    const comunicado = comunicados.find(c => c[0].toString() === idComunicado.toString() && c[4] === "Ativo");
    if (!comunicado) {
      Logger.log(`⚠️ Comunicado ID ${idComunicado} não encontrado ou inativo para ${nome}`);
      continue;
    }

    const assunto = comunicado[2];
    const corpoHtmlOriginal = comunicado[3];

    const template = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #003366;">
          <img src="https://drive.google.com/uc?export=view&id=1Gi3a4bDsmhG1BSG3p1dvl1l6McVngFih" alt="Logo EAC" width="80" style="margin-bottom: 10px;" />
          <h2 style="margin: 0; color: #003366;">EAC – Paróquia Porciúcula de Sant’Ana</h2>
        </div>

        <div style="padding: 20px 0;">
          <p style="font-size: 16px;">Olá <strong>{{NOME}}</strong>,</p>

          <div style="font-size: 15px; line-height: 1.6;">
            {{CONTEUDO_COMUNICADO}}
          </div>
        </div>

        <div style="border-top: 1px solid #ccc; padding-top: 15px; font-size: 13px; color: #777; text-align: center;">
          <p style="margin: 0;">Este e-mail foi enviado automaticamente pelo sistema de comunicação do EAC.</p>
          <p style="margin: 5px 0;">Fique atento aos próximos comunicados!</p>
          <div style="margin-top: 10px;">
            <a href="https://www.instagram.com/eacporciunculadesantana/" target="_blank" style="margin-right: 10px;">
              <img src="https://cdn-icons-png.flaticon.com/24/1384/1384063.png" alt="Instagram" width="20" height="20" style="vertical-align: middle;">
            </a>
            <a href="https://www.facebook.com/profile.php?id=61575049065936" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/24/1384/1384053.png" alt="Facebook" width="20" height="20" style="vertical-align: middle;">
            </a>
          </div>
        </div>
      </div>
    `;

    const corpoHtml = template
      .replace("{{NOME}}", nome)
      .replace("{{CONTEUDO_COMUNICADO}}", corpoHtmlOriginal);

    const destinatario = MODO_SIMULACAO ? EMAIL_TESTE : emailOriginal;

    try {
      GmailApp.sendEmail(destinatario, assunto, "", {
        htmlBody: corpoHtml
      });

      abaFila.getRange(linhaPlanilha, 4).setValue("Enviado");
      abaFila.getRange(linhaPlanilha, 5).setValue(new Date());
      enviadosHoje++;

      Logger.log(`✅ ${MODO_SIMULACAO ? "[Simulado]" : "[Real]"} Enviado para: ${nome} (${destinatario}) | ID Comunicado: ${idComunicado}`);

    } catch (e) {
      Logger.log(`❌ Erro ao enviar para ${nome} (${destinatario}): ${e.message}`);
    }
  }

  Logger.log(`📬 Total enviado hoje: ${enviadosHoje}`);
}

/**
 * Função para marcar como "Pendente" todas as linhas com ID de comunicação preenchido
 */
function marcarComoPendenteTodosComunicados() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getSheetByName("Fila_Envio");
  const dados = aba.getRange(2, 3, aba.getLastRow() - 1, 2).getValues();

  for (let i = 0; i < dados.length; i++) {
    const idComunicado = dados[i][0];
    if (idComunicado && idComunicado.toString().trim() !== "") {
      aba.getRange(i + 2, 4).setValue("Pendente");
    }
  }

  SpreadsheetApp.getUi().alert("📌 Todos os contatos com ID de comunicação foram marcados como 'Pendente'");
}

/**
 * Menu customizado no Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("📬 Comunicação EAC")
    .addItem("Marcar todos com ID como Pendente", "marcarComoPendenteTodosComunicados")
    .addToUi();
}
