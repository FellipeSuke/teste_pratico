using System;
using System.Web.Services;

namespace EISOL_TestePraticoWebForms
{
    public partial class Tarefa2 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Código de inicialização, se necessário.
        }
        [WebMethod]
        public static bool GravarPessoa(DAO.PESSOAS pessoa)
        {
            try
            {
                // Valida os campos no backend
                if (string.IsNullOrWhiteSpace(pessoa.NOME) || string.IsNullOrWhiteSpace(pessoa.CPF))
                    return false;

                // Converte a data de nascimento para DateTime
                DateTime dataNascimento;
                if (!DateTime.TryParse(pessoa.DATA_NASCIMENTO.ToString(), out dataNascimento))
                    return false;

                pessoa.DATA_NASCIMENTO = dataNascimento;

                // Salva no banco
                new BLL.PESSOAS().Adicionar(pessoa);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        protected void btnGravar_Click(object sender, EventArgs e)
        {
            // Validação de campos obrigatórios no servidor
            if (!ValidarCampos())
            {
                return;
            }

            // Preenchendo o objeto pessoa
            var pessoa = new DAO.PESSOAS
            {
                NOME = LimitarTamanho(txtNome.Text, 200),
                CPF = LimitarTamanho(txtCpf.Text, 11),
                RG = LimitarTamanho(txtRg.Text, 15),
                TELEFONE = LimitarTamanho(txtTelefone.Text, 20),
                EMAIL = LimitarTamanho(txtEmail.Text, 200),
                SEXO = ddlSexo.SelectedValue,
                DATA_NASCIMENTO = ObterDataNascimento(txtDataNascimento.Text)
            };

            // Persistindo os dados
            Gravar(pessoa);

            // Limpar os campos após salvar os dados
            Limpar();
        }

        /// <summary>
        /// Valida os campos obrigatórios.
        /// </summary>
        /// <returns>True se todos os campos obrigatórios estão preenchidos, caso contrário false.</returns>
        private bool ValidarCampos()
        {
            if (string.IsNullOrWhiteSpace(txtNome.Text))
            {
                MostrarErro("Preencha o campo NOME");
                return false;
            }

            if (string.IsNullOrWhiteSpace(txtCpf.Text))
            {
                MostrarErro("Preencha o campo CPF");
                return false;
            }

            return true;
        }

        /// <summary>
        /// Converte o texto da data para DateTime. Retorna DateTime.MinValue se não for uma data válida.
        /// </summary>
        /// <param name="dataNascimento">Texto da data de nascimento.</param>
        /// <returns>Data de nascimento convertida ou DateTime.MinValue se inválida.</returns>
        private DateTime ObterDataNascimento(string dataNascimento)
        {
            DateTime data;
            if (DateTime.TryParse(dataNascimento, out data))
            {
                return data;
            }
            return DateTime.MinValue; // Caso a data seja inválida, retorna o valor mínimo
        }


        /// <summary>
        /// Mostra a mensagem de erro.
        /// </summary>
        /// <param name="mensagem">A mensagem de erro.</param>
        private void MostrarErro(string mensagem)
        {
            msgErro.Text = mensagem;
            msgErro.Visible = true;
        }

        /// <summary>
        /// Limita o tamanho do texto.
        /// </summary>
        /// <param name="texto">Texto a ser limitado.</param>
        /// <param name="tamanhoMaximo">Tamanho máximo permitido.</param>
        /// <returns>Texto limitado ao tamanho máximo.</returns>
        private string LimitarTamanho(string texto, int tamanhoMaximo)
        {
            return texto.Length > tamanhoMaximo ? texto.Substring(0, tamanhoMaximo) : texto;
        }

        /// <summary>
        /// Persiste os dados no banco de dados.
        /// </summary>
        /// <param name="pessoa">Objeto DAO.PESSOAS contendo os dados a serem persistidos.</param>
        private void Gravar(DAO.PESSOAS pessoa)
        {
            new BLL.PESSOAS().Adicionar(pessoa);
            Alertar();
        }

        /// <summary>
        /// Exibe o alerta de sucesso após a persistência dos dados.
        /// </summary>
        private void Alertar()
        {
            divAlerta.Visible = true;
        }

        /// <summary>
        /// Limpa todos os campos do formulário.
        /// </summary>
        private void Limpar()
        {
            txtNome.Text = string.Empty;
            txtCpf.Text = string.Empty;
            txtRg.Text = string.Empty;
            txtTelefone.Text = string.Empty;
            txtEmail.Text = string.Empty;
            ddlSexo.SelectedIndex = 0;
            txtDataNascimento.Text = string.Empty;
            msgErro.Visible = false;
            divAlerta.Visible = false;
        }
    }
}
