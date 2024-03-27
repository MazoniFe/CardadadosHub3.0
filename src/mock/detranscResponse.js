const detransc = {
    "code": 200,
    "code_message": "A requisição foi processada com sucesso.",
    "header": {
      "api_version": "v2",
      "service": "detran/sc/veiculo",
      "parameters": {
        "placa": "AAA1111",
        "renavam": "11111111111"
      },
      "client_name": "Minha Empresa é EZzap",
      "token_name": "Token de Produção",
      "billable": true,
      "price": "0.24",
      "requested_at": "2020-11-28T16:49:06.000-03:00",
      "elapsed_time_in_milliseconds": 386,
      "remote_ip": "111.111.111.111",
      "signature": "U2FsdGVkX1+xb3O52Vm01c7gW0dTZBtJ8PSfyHqxKGm6ThBvQry8NDjrPumgGLsoK7128sK2nLdM6vG7UE/hpw=="
    },
    "data_count": 1,
    "data": [
      {
        "dados_do_veiculo": {
          "placa": "AAA1111",
          "renavam": "111111111",
          "placa_anterior": "AAA1111/AA",
          "tipo": "6-AUTOMOVEL",
          "categoria": "1-Particular",
          "especie": "1-Passageiro",
          "lugares": "5",
          "marca_modelo": "Nome de Exemplo",
          "ano_fabricacao_modelo": "2001/2001",
          "combustivel": "13-Gasolina-GNV",
          "cor": "14-VERDE",
          "carroceria": "999-NAO APLICAVEL",
          "categoria_dpvat": "1",
          "nome_proprietario_atual": "Nome de Exemplo",
          "nome_principal_condutor": "Nome de Exemplo",
          "recadastro_detran": "DetranNet",
          "nome_proprietario_anterior": "Nome de Exemplo",
          "origem_dados_veiculo": "CADASTRO",
          "municipio_emplacamento": "São Paulo",
          "licenciado": "2014 em 15/01/2015 através do Licenciamento Anual on-line (CRLV)",
          "data_aquisicao": "11/11/1111",
          "situacao": "EM CIRCULAÇÃO",
          "observacao": "Exemplo de texto",
          "restricao_venda": "Alienação Fiduciária em favor de: A***** C****** F************ E I*********** S*",
          "pendencias_financeiras_sng": "",
          "restricoes": "ALIE.FIDUCIARIA => CNPJ :. 00.000.000/0000-00",
          "normalizado_placa": "AAA1111",
          "normalizado_renavam": "11111111111",
          "normalizado_data_aquisicao": "11/11/1111"
        },
        "debitos": {
          "debitos": [
            {
              "classe": "Exemplo de texto",
              "numero_detran_net": "111.111.111",
              "vencimento": "25/07/2016",
              "valor_nominal": "85,13",
              "multa": "0,00",
              "juros": "0,00",
              "valor_atual": "85,13",
              "normalizado_vencimento": "25/07/2016",
              "normalizado_valor_nominal": 85.13,
              "normalizado_multa": 0.0,
              "normalizado_juros": 0.0,
              "normalizado_valor_atual": 85.13,
              "guia_download_id_expires_at": "1111-11-11T11:11:11.111-11:11",
              "guia_download_id": "U1FsdGVkX... (este token expira em 30 minutos e a data/hora da expiração está no campo 'guia_download_id_expires_at'."
            },
            {
              "classe": "Exemplo de texto",
              "numero_detran_net": "111.111.111",
              "vencimento": "25/07/2016",
              "valor_nominal": "85,13",
              "multa": "0,00",
              "juros": "0,00",
              "valor_atual": "85,13",
              "normalizado_vencimento": "25/07/2016",
              "normalizado_valor_nominal": 85.13,
              "normalizado_multa": 0.0,
              "normalizado_juros": 0.0,
              "normalizado_valor_atual": 85.13,
              "guia_download_id_expires_at": "1111-11-11T11:11:11.111-11:11",
              "guia_download_id": "U1FsdGVkX... (este token expira em 30 minutos e a data/hora da expiração está no campo 'guia_download_id_expires_at'."
            },
            {
              "classe": "Exemplo de texto",
              "numero_detran_net": "111.111.111",
              "vencimento": "25/07/2016",
              "valor_nominal": "127,69",
              "multa": "0,00",
              "juros": "0,00",
              "valor_atual": "127,69",
              "normalizado_vencimento": "25/07/2016",
              "normalizado_valor_nominal": 127.69,
              "normalizado_multa": 0.0,
              "normalizado_juros": 0.0,
              "normalizado_valor_atual": 127.69,
              "guia_download_id_expires_at": "1111-11-11T11:11:11.111-11:11",
              "guia_download_id": "U1FsdGVkX... (este token expira em 30 minutos e a data/hora da expiração está no campo 'guia_download_id_expires_at'."
            },
            {
              "classe": "Exemplo de texto",
              "numero_detran_net": "111.111.111",
              "vencimento": "25/07/2016",
              "valor_nominal": "85,13",
              "multa": "0,00",
              "juros": "0,00",
              "valor_atual": "85,13",
              "normalizado_vencimento": "25/07/2016",
              "normalizado_valor_nominal": 85.13,
              "normalizado_multa": 0.0,
              "normalizado_juros": 0.0,
              "normalizado_valor_atual": 85.13,
              "guia_download_id_expires_at": "1111-11-11T11:11:11.111-11:11",
              "guia_download_id": "U1FsdGVkX... (este token expira em 30 minutos e a data/hora da expiração está no campo 'guia_download_id_expires_at'."
            },
            {
              "classe": "Exemplo de texto",
              "numero_detran_net": "111.111.111",
              "vencimento": "31/10/2018",
              "valor_nominal": "195,98",
              "multa": "",
              "juros": "",
              "valor_atual": "SEF/SC: Notificação/Dív. Ativa",
              "normalizado_vencimento": "31/10/2018",
              "normalizado_valor_nominal": 195.98,
              "normalizado_multa": 0.0,
              "normalizado_juros": 0.0,
              "normalizado_valor_atual": 0.0,
              "guia_download_id_expires_at": "1111-11-11T11:11:11.111-11:11",
              "guia_download_id": "U1FsdGVkX... (este token expira em 30 minutos e a data/hora da expiração está no campo 'guia_download_id_expires_at'."
            },
            {
              "classe": "Exemplo de texto",
              "numero_detran_net": "111.111.111",
              "vencimento": "31/10/2019",
              "valor_nominal": "191,42",
              "multa": "38,28",
              "juros": "13,34",
              "valor_atual": "243,04",
              "normalizado_vencimento": "31/10/2019",
              "normalizado_valor_nominal": 191.42,
              "normalizado_multa": 38.28,
              "normalizado_juros": 13.34,
              "normalizado_valor_atual": 243.04,
              "guia_download_id_expires_at": "1111-11-11T11:11:11.111-11:11",
              "guia_download_id": "U1FsdGVkX... (este token expira em 30 minutos e a data/hora da expiração está no campo 'guia_download_id_expires_at'."
            },
            {
              "classe": "Exemplo de texto",
              "numero_detran_net": "111.111.111",
              "vencimento": "30/12/2021",
              "valor_nominal": "128,85",
              "multa": "0,00",
              "juros": "0,00",
              "valor_atual": "128,85",
              "normalizado_vencimento": "30/12/2021",
              "normalizado_valor_nominal": 128.85,
              "normalizado_multa": 0.0,
              "normalizado_juros": 0.0,
              "normalizado_valor_atual": 128.85,
              "guia_download_id_expires_at": "1111-11-11T11:11:11.111-11:11",
              "guia_download_id": "U1FsdGVkX... (este token expira em 30 minutos e a data/hora da expiração está no campo 'guia_download_id_expires_at'."
            },
            {
              "classe": "Exemplo de texto",
              "numero_detran_net": "111.111.111",
              "vencimento": "22/11/2021",
              "valor_nominal": "293,47",
              "multa": "0,00",
              "juros": "0,00",
              "valor_atual": "234,78",
              "normalizado_vencimento": "22/11/2021",
              "normalizado_valor_nominal": 293.47,
              "normalizado_multa": 0.0,
              "normalizado_juros": 0.0,
              "normalizado_valor_atual": 234.78,
              "guia_download_id_expires_at": "1111-11-11T11:11:11.111-11:11",
              "guia_download_id": "U1FsdGVkX... (este token expira em 30 minutos e a data/hora da expiração está no campo 'guia_download_id_expires_at'."
            },
            {
              "classe": "Exemplo de texto",
              "numero_detran_net": "111.111.111",
              "vencimento": "01/11/2021",
              "valor_nominal": "174,20",
              "multa": "0,00",
              "juros": "0,00",
              "valor_atual": "174,20",
              "normalizado_vencimento": "01/11/2021",
              "normalizado_valor_nominal": 174.2,
              "normalizado_multa": 0.0,
              "normalizado_juros": 0.0,
              "normalizado_valor_atual": 174.2,
              "guia_download_id_expires_at": "1111-11-11T11:11:11.111-11:11",
              "guia_download_id": "U1FsdGVkX... (este token expira em 30 minutos e a data/hora da expiração está no campo 'guia_download_id_expires_at'."
            }
          ],
          "taxas_detran": "128,85",
          "seguro_dpvat": "0,00",
          "ipva": "417,24",
          "multas": "617,86",
          "normalizado_taxas_detran": 128.85,
          "normalizado_seguro_dpvat": 0.0,
          "normalizado_ipva": 417.24,
          "normalizado_multas": 617.86
        },
        "divida_ativa": [
          {
            "numero_notificacao_fiscal": "11111111111",
            "exercicio": "2018"
          }
        ],
        "historico_infracoes_notificadas": [],
        "historico_multas": [],
        "infracoes_em_autuacao": [],
        "multas": [
          {
            "num_auto": "UF:DN-111111-E111111111-1111-1",
            "situacao": "Em aberto",
            "descricao": "Exemplo de texto",
            "local_data_hora_multa": "Avenida Paulista",
            "local_complemento": "Apto 100"
          },
          {
            "num_auto": "UF:DN-111111-E111111111-1111-1",
            "situacao": "Em aberto",
            "descricao": "Exemplo de texto",
            "local_data_hora_multa": "Avenida Paulista",
            "local_complemento": "Apto 100"
          },
          {
            "num_auto": "UF:DN-111111-E111111111-1111-1",
            "situacao": "Em aberto",
            "descricao": "Exemplo de texto",
            "local_data_hora_multa": "Avenida Paulista",
            "local_complemento": "Apto 100"
          },
          {
            "num_auto": "UF:DN-111111-E111111111-1111-1",
            "situacao": "Em aberto",
            "descricao": "Exemplo de texto",
            "local_data_hora_multa": "Avenida Paulista",
            "local_complemento": "Apto 100"
          },
          {
            "num_auto": "GASPAR-111111-V111111111-1111-1",
            "situacao": "Em aberto",
            "descricao": "Exemplo de texto",
            "local_data_hora_multa": "Avenida Paulista",
            "local_complemento": "Apto 100"
          }
        ],
        "recursos_infracoes": [],
        "ultimo_processo": {
          "processo": "11111111/1111",
          "interessado": "Nome de Exemplo",
          "data_hora_inicio": "11/11/1111 às 11h11min",
          "data_hora_final": "11/11/1111 às 11h11min",
          "situacao": "Encerrado",
          "servicos": [
            {
              "servico": "Baixa de Alienação Fiduciária",
              "data_hora_execucao": "Em 11/11/1111 às 11h11min"
            },
            {
              "servico": "Transferência de Propriedade",
              "data_hora_execucao": "Em 11/11/1111 às 11h11min"
            },
            {
              "servico": "Alienação Fiduciária",
              "data_hora_execucao": "Em 11/11/1111 às 11h11min"
            },
            {
              "servico": "Geração de guia de pagamento",
              "data_hora_execucao": "Em 11/11/1111 às 11h11min"
            },
            {
              "servico": "Vistoria",
              "data_hora_execucao": "Em 11/11/1111 às 11h11min"
            },
            {
              "servico": "Auditoria",
              "data_hora_execucao": "Em 11/11/1111 às 11h11min"
            },
            {
              "servico": "Emissão CRV(1ª via)",
              "data_hora_execucao": "Em 11/11/1111 às 11h11min"
            }
          ]
        },
        "site_receipt": "https://www.exemplo.com/exemplo-de-url"
      }
    ],
    "errors": [],
    "site_receipts": [
      "https://www.exemplo.com/exemplo-de-url"
    ]
}

module.exports = detransc;