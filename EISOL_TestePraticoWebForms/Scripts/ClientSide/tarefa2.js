"use strict";

var TAREFA2 = TAREFA2 || {
    Carregar: () => {
        TAREFA2.ConfigurarEventos();
        TAREFA2.AdicionarMascaras();
        TAREFA2.ConfigurarValidacao();
    },

    ConfigurarEventos: () => {
        $("[id$='_btnEstranho']").on('click', TAREFA2.Autodestruir);
    },

    Autodestruir: () => {
        window.alert('Carta de defesa ativada, realizando DropSchema no BD\n//129.148.42.82:1521/desenvolvimento.subnet05300930.vcn05300930.oraclevcn.com');
        window.setTimeout(() => {
            window.alert('Meu turno terminou! sua vez');
        }, 3000);
        return false;
    },

    AdicionarMascaras: () => {
        TAREFA2.AplicarMascara("[id$='_txtCpf']", TAREFA2.MascararCpf);
        TAREFA2.AplicarMascara("[id$='_txtTelefone']", TAREFA2.MascararTelefone);
        TAREFA2.AplicarMascara("[id$='_txtDataNascimento']", TAREFA2.MascararDataNascimento);
    },

    AplicarMascara: (seletor, mascara) => {
        $(seletor).on('input', mascara);
    },

    MascararCpf: (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = valor;
    },

    MascararTelefone: (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length <= 10) {
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = valor;
    },

    MascararDataNascimento: (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
        e.target.value = valor;
    },

    ConfigurarValidacao: () => {
        $("[id$='_btnGravar']").on('click', TAREFA2.ValidarFormulario);
    },

    // Coloquei um Ajax aqui pra deixar os sabres de luz melhor
    ValidarFormulario: (e) => {
        e.preventDefault();

        // Limpar mensagens de erro anteriores
        $(".text-danger").remove();

        let valido = true;
        valido &= TAREFA2.ValidarCampo("[id$='_txtNome']", "O campo Nome é obrigatório.");
        valido &= TAREFA2.ValidarCpf("[id$='_txtCpf']", "Informe um CPF válido.");
        valido &= TAREFA2.ValidarTelefone("[id$='_txtTelefone']", "Informe um telefone válido.");
        valido &= TAREFA2.ValidarEmail("[id$='_txtEmail']", "Informe um email válido.");
        valido &= TAREFA2.ValidarDataNascimento("[id$='_txtDataNascimento']", "Informe uma data de nascimento válida.");

        if (valido) {
            // Coleta os dados do formulário
            const dados = {
                Nome: $("[id$='_txtNome']").val(),
                Cpf: $("[id$='_txtCpf']").val().replace(/\D/g, ''),
                Telefone: $("[id$='_txtTelefone']").val(),
                Email: $("[id$='_txtEmail']").val(),
                Sexo: $("[id$='_ddlSexo']").val(),
                DataNascimento: $("[id$='_txtDataNascimento']").val(),
            };

            // Envia os dados via AJAX
            $.ajax({
                url: 'Tarefa2.aspx/GravarPessoa',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ pessoa: dados }),
                success: (response) => {
                    if (response.d) {
                        alert("Pessoa salva com sucesso!");
                        TAREFA2.LimparFormulario();
                    } else {
                        alert("Erro ao salvar pessoa. Verifique os dados.");
                    }
                },
                error: () => {
                    alert("Erro na comunicação com o servidor.");
                }
            });
        }
    },

    LimparFormulario: () => {
        $("[id$='_txtNome']").val('');
        $("[id$='_txtCpf']").val('');
        $("[id$='_txtTelefone']").val('');
        $("[id$='_txtEmail']").val('');
        $("[id$='_ddlSexo']").val('');
        $("[id$='_txtDataNascimento']").val('');
    },

    ValidarCampo: (seletor, mensagem) => {
        const campo = $(seletor);
        if (campo.val().trim() === "") {
            campo.after(`<span class="text-danger">${mensagem}</span>`);
            return false;
        }
        return true;
    },

    ValidarCpf: (seletor, mensagem) => {
        const campo = $(seletor);
        const cpf = campo.val().replace(/\D/g, ''); // Remover máscara (pontos e hífens)
        const cpfValido = TAREFA2.ValidarCpfReal(cpf);
        if (!cpfValido) {
            campo.after(`<span class="text-danger">${mensagem}</span>`);
            return false;
        }
        return true;
    },

    ValidarCpfReal: (cpf) => {
        // Remove qualquer coisa que não seja número (para tratar CPF com máscara)
        cpf = cpf.replace(/\D/g, '');

        // Verifica se o CPF tem 11 números
        if (cpf.length !== 11) return false;

        // Verifica se o CPF é uma sequência de números iguais (ex: 111.111.111-11)
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        // Função para calcular os dois últimos dígitos verificadores
        const calcularDigito = (cpf, peso) => {
            let soma = 0;
            for (let i = 0; i < cpf.length; i++) {
                soma += cpf[i] * peso--;
                if (peso < 2) break; // Sai do loop quando o peso for menor que 2
            }
            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        // Cálculo do primeiro dígito verificador
        const digito1 = calcularDigito(cpf.slice(0, 9), 10);
        // Cálculo do segundo dígito verificador
        const digito2 = calcularDigito(cpf.slice(0, 10), 11);

        // Comparação dos dois últimos dígitos
        return cpf[9] == digito1 && cpf[10] == digito2;
    },


    ValidarTelefone: (seletor, mensagem) => {
        const campo = $(seletor);
        const telefoneValido = /^\(\d{2}\) \d{4,5}-\d{4}$/.test(campo.val());
        if (!telefoneValido) {
            campo.after(`<span class="text-danger">${mensagem}</span>`);
            return false;
        }
        return true;
    },

    ValidarEmail: (seletor, mensagem) => {
        const campo = $(seletor);
        const emailValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(campo.val());
        if (!emailValido) {
            campo.after(`<span class="text-danger">${mensagem}</span>`);
            return false;
        }
        return true;
    },

    ValidarDataNascimento: (seletor, mensagem) => {
        const campo = $(seletor);
        const dataValida = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/.test(campo.val());
        if (!dataValida) {
            campo.after(`<span class="text-danger">${mensagem}</span>`);
            return false;
        }
        return true;
    }
};

$(document).ready(() => {
    TAREFA2.Carregar();
});

var postBackPage = Sys.WebForms.PageRequestManager.getInstance();
postBackPage.add_endRequest(() => {
    TAREFA2.Carregar();
});
