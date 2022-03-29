import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import "./NewForm.css";

const NewForm = (props) => {
  const { register, handleSubmit, reset } = useForm();
  const [countId, setIdCount] = useState(0);
  const [uniqueId, setUniqueId] = useState("");
  const address = props.address;

  const apiBaseUrl = "https://nftmetamask.free.beeceptor.com";
  const randomString = (length) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  };

  useEffect(() => {
    setUniqueId(randomString(18));
  }, []);

  const onSubmit = async (data) => {
    const formDetails = {
      asset_id: uniqueId ? uniqueId : data?.asset_id,
      name: data?.name,
      image: data?.image[0]?.name,
      link: data?.link,
      desc: data.desc,
      collection: data.collection,
      supply: data.supply,
      royalties: data.royalties,
      date_of_creation: new Date().toString(),
    };

    let updatedData;
    const localData = JSON.parse(localStorage.getItem("formData"));
    if (localData) {
      localData[countId] = formDetails;
      window.localStorage.removeItem("formData");
      localStorage.setItem("formData", JSON.stringify(localData));
      updatedData = JSON.parse(localStorage.getItem("formData"));
    } else {
      updatedData = formDetails;
    }

    const nftFormObj = {
      creator_wallet_id: address,
      creator_network: address,
      assets: [updatedData]
    }
    console.log(nftFormObj);
    let res = await fetch(`${apiBaseUrl}/user`, {
      method: "POST",
      body: JSON.stringify(nftFormObj),
    });

    let resJson = await res.json();
    console.log("Api response:",resJson);
    reset();
    setUniqueId(randomString(18));
    window.localStorage.removeItem("formData");
  };

  const addAnother = () => {
    handleSubmit((data) => {
      const formDetails = {
        asset_id: uniqueId ? uniqueId : data?.asset_id,
        name: data.name,
        image: data.image[0]?.name,
        link: data.link,
        desc: data.desc,
        collection: data.collection,
        supply: data.supply,
        royalties: data.royalties,
        date_of_creation: new Date().toString(),
      };

      const localData = JSON.parse(localStorage.getItem("formData")) || {};
      localData[countId] = formDetails;
      localStorage.setItem("formData", JSON.stringify(localData));
      setIdCount(countId + 1);
      reset();
      setUniqueId(randomString(18));
    })();
  };

  return (
    <div className="new-expense">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="new-expense__controls">
          <div className="new-expense__control">
            <label>Asset Id:</label>
            <input type="text" {...register("asset_id")} value={uniqueId} />
          </div>
          <div className="new-expense__control">
            <label>Name:</label>
            <input type="text" {...register("name")} />
          </div>
          <div className="new-expense__control">
            <label>Picture:</label>
            <input type="file" {...register("image")} accept="image/*" />
          </div>
          <div className="new-expense__control">
            <label>External Link:</label>
            <input type="text" {...register("link")} />
          </div>
          <div className="new-expense__control">
            <label>Description:</label>
            <input type="text" {...register("desc")} />
          </div>
          <div className="new-expense__control">
            <label>Collection:</label>
            <input type="text" {...register("collection")} />
          </div>
          <div className="new-expense__control">
            <label>Supply:</label>
            <input type="number" min="0.01" step="0.01" {...register("supply")} />
          </div>
          <div className="new-expense__control">
            <label>Royalties:</label>
            <input type="number" min="1" step="any" {...register("royalties")} />
          </div>
        </div>
        <div className="new-expense__actions">
          <button type="button" onClick={addAnother}>
            Add Another NFT
          </button>
          <button type="submit">Mint</button>
        </div>
      </form>
    </div>
  );
};

export default NewForm;
