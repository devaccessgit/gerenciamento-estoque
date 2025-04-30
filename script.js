document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("product-form");
    const lista = document.getElementById("product-list");
    const filtro = document.getElementById("filtro");
    const totalGeral = document.getElementById("total-geral");
    const mensagens = document.getElementById("mensagens");
    let produtos = JSON.parse(localStorage.getItem("estoque")) || [];
    let editIndex = null;
  
    function salvarLocal() {
      localStorage.setItem("estoque", JSON.stringify(produtos));
    }
  
    function formatarValor(valor) {
      return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }
  
    function atualizarTabela(filtroTexto = "") {
      lista.innerHTML = "";
      let total = 0;
      const termo = filtroTexto.toLowerCase();
  
      produtos
        .filter(p => p.nome.toLowerCase().includes(termo) || p.codigo.toLowerCase().includes(termo))
        .forEach((p, i) => {
          const subtotal = p.quantidade * p.preco;
          total += subtotal;
  
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${p.codigo}</td>
            <td>${p.nome}</td>
            <td>${p.quantidade}</td>
            <td>${formatarValor(p.preco)}</td>
            <td>${formatarValor(subtotal)}</td>
            <td>${p.dataEntrada}</td>
            <td>
              <button class="edit btn btn-sm btn-warning me-1" onclick="editarProduto(${i})" title="Editar">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete btn btn-sm btn-danger" onclick="removerProduto(${i})" title="Excluir">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          `;
          lista.appendChild(tr);
        });
  
      totalGeral.textContent = formatarValor(total);
    }
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const codigo = document.getElementById("codigo").value.trim();
      const nome = document.getElementById("nome").value.trim();
      const quantidade = parseInt(document.getElementById("quantidade").value);
      const preco = parseFloat(document.getElementById("preco").value);
      const dataEntrada = document.getElementById("dataEntrada").value;
  
      if (!codigo || !nome || isNaN(quantidade) || isNaN(preco) || !dataEntrada || quantidade <= 0 || preco <= 0) {
        alert("Preencha todos os campos corretamente.");
        return;
      }
  
      const produto = { codigo, nome, quantidade, preco, dataEntrada };
  
      if (editIndex === null) {
        produtos.push(produto);
        mensagens.innerHTML = `<div class="alert alert-success">Produto adicionado com sucesso!</div>`;
      } else {
        produtos[editIndex] = produto;
        mensagens.innerHTML = `<div class="alert alert-warning">Produto atualizado com sucesso!</div>`;
        editIndex = null;
      }
  
      salvarLocal();
      atualizarTabela(filtro.value);
      form.reset();
      document.getElementById("codigo").focus();
      setTimeout(() => mensagens.innerHTML = "", 3000);
    });
  
    window.editarProduto = function (index) {
      const p = produtos[index];
      document.getElementById("codigo").value = p.codigo;
      document.getElementById("nome").value = p.nome;
      document.getElementById("quantidade").value = p.quantidade;
      document.getElementById("preco").value = p.preco;
      document.getElementById("dataEntrada").value = p.dataEntrada;
      editIndex = index;
    };
  
    window.removerProduto = function (index) {
      if (confirm("Deseja realmente excluir este produto?")) {
        produtos.splice(index, 1);
        salvarLocal();
        atualizarTabela(filtro.value);
      }
    };
  
    filtro.addEventListener("input", () => atualizarTabela(filtro.value));
  
    window.exportarCSV = function () {
      if (produtos.length === 0) {
        alert("Nenhum produto para exportar.");
        return;
      }
  
      let csv = "Código;Produto;Quantidade;Preço;Total;Data de Entrada\n";
      produtos.forEach(p => {
        const total = (p.quantidade * p.preco).toFixed(2).replace('.', ',');
        csv += `${p.codigo};${p.nome};${p.quantidade};${p.preco.toFixed(2).replace('.', ',')};${total};${p.dataEntrada}\n`;
      });
  
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "estoque.csv";
      a.click();
      URL.revokeObjectURL(url);
    };
  
    window.exportarPDF = function () {
      if (produtos.length === 0) {
        alert("Nenhum produto para exportar.");
        return;
      }
  
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Relatório de Estoque", 14, 20);
  
      const headers = [["Código", "Produto", "Quantidade", "Preço (R$)", "Total (R$)", "Data de Entrada"]];
      const data = produtos.map(p => [
        p.codigo,
        p.nome,
        p.quantidade,
        p.preco.toFixed(2).replace('.', ','),
        (p.quantidade * p.preco).toFixed(2).replace('.', ','),
        p.dataEntrada
      ]);
  
      doc.autoTable({
        startY: 30,
        head: headers,
        body: data
      });
  
      const dataAtual = new Date();
      const nomeArquivo = `estoque_${dataAtual.toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      doc.save(nomeArquivo);
    };
  
    atualizarTabela();
  });