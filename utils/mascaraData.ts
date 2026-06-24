export function mascaraData(texto: string): string {
  const numeros = texto.replace(/\D/g, "");

  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
}

export function dataParaISO(dataBR: string): string {
  const [dia, mes, ano] = dataBR.split("/");
  return `${ano}-${mes}-${dia}`;
}

export function dataParaBR(dataISO: string): string {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function validarData(dataBR: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dataBR)) return false;

  const [dia, mes, ano] = dataBR.split("/").map(Number);

  if (mes < 1 || mes > 12) return false;
  if (dia < 1) return false;
  if (ano < 2000) return false;

  const diasNoMes = new Date(ano, mes, 0).getDate();
  if (dia > diasNoMes) return false;

  return true;
}
