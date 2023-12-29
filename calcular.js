var impostoRetido = 0;
var valorLiquidoTotal = 0;
function calcularAvaliacoesInep(){
    criarElemento("h1","titulo","body");
    document.querySelector('#titulo').innerHTML = 'Calculadora de Valores de Avaliações - INEP';
    criarElemento("main","principal","body");
    criarElemento('label','qdadeAv','#principal');
    document.querySelector('#qdadeAv').innerHTML='Informe a quantidade de avaliações a receber no mês:';
    criarElemento('input','inputQdadeAv','#principal');
    document.querySelector('#inputQdadeAv').type='number';
    document.querySelector('#inputQdadeAv').min=1;
    document.querySelector('#inputQdadeAv').setAttribute("onChange","tipoAvaliacao(inputQdadeAv.value)");
}
function tipoAvaliacao(quantidade){
    if (document.getElementById("divAv")) {
        divAv.remove();
    }
    if (document.getElementById("divResumo")) {
        divResumo.remove();
        impostoRetido = 0;
        valorLiquidoTotal = 0;
    }
    criarElemento("div","divAv","body");
    criarElemento("form","formulario","#divAv");
    document.querySelector('#formulario').setAttribute("method",'post');
    document.querySelector('#formulario').setAttribute('action','#');
    criarElemento("h2","tituloAvaliacoes","#formulario");
    document.querySelector('#tituloAvaliacoes').innerHTML = 'Avaliações<BR>';
    for (let index = 0; index < quantidade; index++) {
        let cont = index + 1;
        criarElemento('label','av'+cont,'#formulario');
        document.querySelector('#av'+cont).innerHTML='<b>Avaliação'+cont+":</b> ";
        criarElemento('select','selectav'+cont,'#formulario');
        document.querySelector('#selectav'+cont).setAttribute('onChange','calcularValor(this.id,'+quantidade+')');
        criarElemento('option','optVazio','#selectav'+cont);
        document.querySelector('#optVazio').innerHTML = "";
        criarElemento('option','optAutorizacao'+cont,'#selectav'+cont);
        document.querySelector('#optAutorizacao'+cont).innerHTML = "Autorização";
        criarElemento('option','optReconhecimento'+cont,'#selectav'+cont);
        document.querySelector('#optReconhecimento'+cont).innerHTML = "Reconhecimento";
        criarElemento('label','valorBrutoAv'+cont,'#formulario');
        criarElemento('label','valorLiquidoAv'+cont,'#formulario');
        criarElemento('br','','#formulario');
        criarElemento('br','','#formulario');
    }
}
function calcularValor(id, qdade){
    let salarioBruto = 0;
    let impostoDevido = 0;
    let valorLiquido = 0;
    document.querySelector('#'+id).setAttribute('disabled','true');
    for (let index = 0; index < qdade; index++) {
        if (document.getElementById("selectav"+(index+1)).value=='Reconhecimento') {
                 salarioBruto +=4500;
              } else{
                  if (document.getElementById("selectav"+(index+1)).value=='Autorização') {
                      salarioBruto+=3000;
                  }
         }
     }
     imposto = calcularImposto(salarioBruto);
     impostoDevido = imposto-impostoRetido; 
    if (document.getElementById(id).value=='Reconhecimento') {
        let numero = id.split("selectav")[1];
        document.querySelector('#valorBrutoAv'+numero).innerHTML = "<BR>Valor da Avaliação de Reconhecimento: R$4500";
        valorLiquido+=4500-impostoDevido;
        valorLiquidoTotal+=4500-impostoDevido;
        document.querySelector('#valorLiquidoAv'+numero).innerHTML = "<BR>Valor Líquido após IRPF: R$"+valorLiquido.toFixed(2);
    } else{
        if (document.getElementById(id).value=='Autorização') {
            let numero = id.split("selectav")[1];
            document.querySelector('#valorBrutoAv'+numero).innerHTML = "<BR>Valor da Avaliação de Autorização: R$3000";
            valorLiquido +=3000-impostoDevido;
            document.querySelector('#valorLiquidoAv'+numero).innerHTML = "<BR>Valor Líquido após IRPF: "+valorLiquido.toFixed(2);
        }
    }
    impostoRetido+=impostoDevido;
    if (document.getElementById("divResumo")) {
        divResumo.remove();
    }
    criarElemento("div","divResumo","body");
    criarElemento("h2","tituloResumo","#divResumo");
    document.querySelector('#tituloResumo').innerHTML = 'Resumo<BR>';
    criarElemento('label','valorBruto','#divResumo');
    document.querySelector('#valorBruto').innerHTML='Valor bruto recebido no mês: R$'+salarioBruto.toFixed(2);
    criarElemento('label','valorLiquido','#divResumo');
    document.querySelector('#valorLiquido').innerHTML='<BR>Valor liquido recebido no mês: R$'+valorLiquidoTotal.toFixed(2);
    criarElemento('label','valorImposto','#divResumo');
    document.querySelector('#valorImposto').innerHTML='<BR>Imposto retido no mês: R$'+impostoRetido.toFixed(2);
}
function calcularImposto(salarioBruto){
    const faixas = [[0, 2112], [2112.01, 2826.65], [2826.66, 3751.05], [3751.06, 4664.68], [4664.69, 999999.99]];
    const deducoes = [0 , 1458.40, 370.40, 651.73, 884.96];
    const aliquotas = [0.0, 0.075, 0.15, 0.225, 0.275];
    let base_de_calculo = salarioBruto;
    for (let index = 0; index < faixas.length; index++) {
        for (let index1 = 0; index1 < faixas[index].length; index1++) {
            faixamin = faixas[index][index1];
            faixamax = faixas[index][index1+1];
            if(faixamax == 999999.99){
                faixamax = base_de_calculo;
            }
            if((faixamin<=base_de_calculo) && (base_de_calculo<=faixamax)){
                var impostoDevido = base_de_calculo*aliquotas[index]-deducoes[index];
                break;
            }
            index1++;
        }
    }
    return impostoDevido;
}
function criarElemento(elemento,identificador,elementoPai){
    let el = document.createElement(elemento);
    el.id = identificador;
    document.querySelector(elementoPai).appendChild(el);
}