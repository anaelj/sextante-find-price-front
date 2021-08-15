/* eslint-disable react/jsx-no-target-blank */
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";
import api from "./api/api.js";

interface IPricesData {
  name: string;
  price: string;
  link: string;
}

const Home: NextPage = () => {
  const [textSearch, setTextSearch] = useState("");
  const [exactSearch, setExactSearch] = useState(false);
  const [pricesData, setPricesData] = useState<IPricesData[]>([
    { name: "teste", price: "0", link: "" },
    { name: "teste 2", price: "0", link: "" },
  ]);
  const [priceDataSorted, setPriceDataSorted] = useState<IPricesData[]>([]);

  const search = (value: string) => {
    console.log(`Pesquisando por... ${value}`);
    api.get(`/prices?textSearch=${value}`).then((res) => {
      setPricesData(res.data);
      console.log(`Pesquisa concluída... ${value}`);
    });
  };

  useEffect(() => {
    setPriceDataSorted(
      pricesData
        .filter((item) => {
          const price = String(item.price)
            .trim()
            .replace(".", "")
            .replace(",", "");
          return (
            ((exactSearch &&
              String(item.name)
                .toUpperCase()
                .includes(textSearch.toUpperCase())) ||
              !exactSearch) &&
            Number(price) > 0
          );
        })
        .sort(function (a, b) {
          if (Number(a.price) > Number(b.price)) {
            return 1;
          }
          if (Number(a.price) < Number(b.price)) {
            return -1;
          }
          return 0;
        })
    );

    console.log(priceDataSorted);
  }, [pricesData, exactSearch]);

  return (
    <>
      <header>
        <div className="container">
          <label htmlFor="pesquisa">Pesquise</label>
          <input
            type="text"
            name="pesquisa"
            id="pesquisa"
            placeholder="gtx 1660 super"
            value={textSearch}
            onChange={(e) => setTextSearch(e.target.value)}
          />
          <button onClick={() => search(textSearch)}>Pesquisar</button>
          <button onClick={() => setExactSearch(!exactSearch)}>
            {exactSearch ? "Pesquisa Aproximada" : "Pesquisa exata"}
          </button>
        </div>
      </header>
      <main>
        <div className="container">
          {priceDataSorted.length > 0 &&
            priceDataSorted.map((item, idx) => {
              return (
                <div className="row" key={idx}>
                  <div
                    className={`col-sm-8 col-md-8 col-lg-11 col-xl-11 ${styles.name}`}
                  >
                    <div className={styles.teste}>
                      <a target="_blank" href={item.link}>
                        {item.name}
                      </a>
                    </div>
                  </div>
                  <div
                    className={`col-sm-1 col-md-1 col-lg-1 col-xl-1 ${styles.price}`}
                  >
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(item.price))}
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
};

export default Home;
