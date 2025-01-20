using System;

namespace EISOL_TestePraticoWebForms
{
    public partial class Tarefa3 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!this.Page.IsPostBack)
            {
                this.CarregarControles();
            }
        }

        /// <summary>
        /// Carregar dados e povoar os controles
        /// </summary>
        private void CarregarControles()
        {
            // Povoando as Unidades da Federação.
            this.ddlUf.Items.Clear();
            this.ddlUf.DataSource = new BLL.UF().CarregarTodos();
            this.ddlUf.DataTextField = "NOME";
            this.ddlUf.DataValueField = "COD_UF";
            this.ddlUf.DataBind();

            // Povoando as Cidades
            this.CarregarCidades(null);
        }

        protected void ddlUf_SelectedIndexChanged(object sender, EventArgs e)
        {
            // Obtém a UF selecionada no dropdown.
            string ufSelecionada = this.ddlUf.SelectedValue;

            if (!string.IsNullOrEmpty(ufSelecionada))
            {
                // Recarrega as cidades correspondentes à UF selecionada.
                this.CarregarCidades(ufSelecionada);
            }
        }

        /// <summary>
        /// Carregar as cidades baseadas na UF selecionada
        /// </summary>
        /// <param name="uf">Código da UF</param>
        private void CarregarCidades(string uf)
        {
            this.ddlCidades.Items.Clear();

            // Busca todas as cidades ou apenas as da UF selecionada.
            var cidades = string.IsNullOrEmpty(uf)
                ? new BLL.CIDADES().CarregarTodos()
                : new BLL.CIDADES().CarregarPorUF(Decimal.Parse(uf));

            this.ddlCidades.DataSource = cidades; // Define a fonte de dados para o dropdown.
            this.ddlCidades.DataTextField = "NOME"; // Nome da cidade exibido no dropdown.
            this.ddlCidades.DataValueField = "COD_CIDADE"; // Código da cidade como valor interno.
            this.ddlCidades.DataBind();
        }
    }
}