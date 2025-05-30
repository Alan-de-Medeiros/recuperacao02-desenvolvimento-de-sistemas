"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.css";

type Dev = {
  id: number;
  name: string;
  tech: string[];
  description?: string;
  githubUrl?: string;
  avatarUrl?: string;
};

export default function DevList() {
  const [devs, setDevs] = useState<Dev[]>([]);

  useEffect(() => {
    carregarDevs();
  }, []);

  function carregarDevs() {
    const local = localStorage.getItem("devs");
    if (local) {
      setDevs(JSON.parse(local));
    }
  }

  function adicionarDev(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name")?.toString().trim() || "";
    const techText = formData.get("tech")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const github = formData.get("github")?.toString().trim() || "";
    const avatar = formData.get("avatar")?.toString().trim() || "";

    if (!name || !techText) {
      console.log("Preencha nome e tecnologias!");
      return;
    }

    const novoDev: Dev = {
      id: Math.floor(Math.random() * 1000000),
      name,
      tech: techText.split(",").map((t) => t.trim()).filter(Boolean),
      description,
      githubUrl: github ? `https://github.com/${github}` : "",
      avatarUrl: avatar,
    };

    const novosDevs = [...devs, novoDev];
    setDevs(novosDevs);
    localStorage.setItem("devs", JSON.stringify(novosDevs));
    form.reset();
  }

  function deletarDev(id: number) {
    const filtrados = devs.filter((dev) => dev.id !== id);
    setDevs(filtrados);
    localStorage.setItem("devs", JSON.stringify(filtrados));
  }


  return (
    <div className={styles.container}>
      <h1>Cadastre os desenvolvedores</h1>

      <form onSubmit={adicionarDev} className={styles.form}>
        <input name="name" placeholder="Nome completo" required />
        <input name="tech" placeholder="Tecnologias" required />
        <textarea name="description" placeholder="Sobre você" />
        <input name="github" placeholder="UserGitHub" />
        <input name="avatar" placeholder="Endereço da imagem" />
        <button type="submit">Adicionar Dev</button>
      </form>

      <ul className={styles.devList}>
        {devs.map((dev) => (
          <li key={dev.id} className={styles.devItem}>
            {dev.avatarUrl && (
              <img src={dev.avatarUrl} alt={dev.name} className={styles.avatar} />
            )}
            <h2>{dev.name}</h2>
            <p>Tecnologias: {dev.tech.join(", ")}</p>
            {dev.description && <p>Bio: {dev.description}</p>}
            {dev.githubUrl && (
              <p>
                GitHub:{" "}
                <a href={dev.githubUrl} target="_blank" rel="noreferrer">
                  @{dev.githubUrl.split("/").pop()}
                </a>
              </p>
            )}

            <div className={styles.buttons}>
              <button onClick={() => deletarDev(dev.id)}>Remover</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
