import * as SQLite from "expo-sqlite";
import { Reagente } from "../types";

const db = SQLite.openDatabaseSync("lab_reagentes.db");

export function initDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS reagentes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      fabricante TEXT,
      lote TEXT,
      validade TEXT NOT NULL,
      quantidade TEXT,
      localizacao TEXT,
      observacoes TEXT,
      foto TEXT
    );
  `);
}

export function inserirReagente(dados: Omit<Reagente, "id">): void {
  db.runSync(
    `INSERT INTO reagentes (nome, fabricante, lote, validade, quantidade, localizacao, observacoes, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      dados.nome,
      dados.fabricante,
      dados.lote,
      dados.validade,
      dados.quantidade,
      dados.localizacao,
      dados.observacoes,
      dados.foto,
    ],
  );
}

export function listarReagentes(): Reagente[] {
  return db.getAllSync<Reagente>(
    "SELECT * FROM reagentes ORDER BY validade ASC;",
  );
}

export function buscarReagente(id: number): Reagente | null {
  return (
    db.getFirstSync<Reagente>("SELECT * FROM reagentes WHERE id = ?;", [id]) ??
    null
  );
}

export function atualizarReagente(
  id: number,
  dados: Omit<Reagente, "id">,
): void {
  db.runSync(
    `UPDATE reagentes SET nome=?, fabricante=?, lote=?, validade=?, quantidade=?, localizacao=?, observacoes=?, foto=?
     WHERE id=?;`,
    [
      dados.nome,
      dados.fabricante,
      dados.lote,
      dados.validade,
      dados.quantidade,
      dados.localizacao,
      dados.observacoes,
      dados.foto,
      id,
    ],
  );
}

export function deletarReagente(id: number): void {
  db.runSync("DELETE FROM reagentes WHERE id = ?;", [id]);
}
