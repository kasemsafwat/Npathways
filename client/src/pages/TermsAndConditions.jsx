import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useState } from "react";

const TermsAndConditions = () => {
  const [agreed, setAgreed] = useState(false);

  const handleAgreementChange = (e) => {
    setAgreed(e.target.value === "agree");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Terms and Conditions
      </h1>

      <div className="h-96 overflow-y-auto border border-gray-200 p-4 mb-6">
        <p className="text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
          cupiditate quis eius aut itaque voluptatibus sunt in magnam earum
          assumenda esse ab reprehenderit ullam illo quos id incidunt, adipisci
          explicabo possimus. Amet quae at rem blanditiis dolores iste tempore
          inventore architecto veniam officia? Quos cupiditate quia id nihil.
          Nostrum molestias obcaecati fuga tenetur repellat sit dignissimos
          libero reiciendis pariatur consectetur, iusto, sint dolore esse enim
          cum, magni possimus nisi alias ab numquam? Quis, accusamus doloremque
          rem nisi illo dolorum iusto harum veritatis, mollitia, impedit
          adipisci corrupti ratione corporis maxime aliquam architecto
          consequatur sed quos et! Nobis pariatur laborum dolorem reprehenderit,
          enim debitis commodi, quas delectus illo sequi exercitationem ipsum
          voluptatum nemo ab, tempora quia. Commodi molestiae ullam repudiandae
          provident. Quod iure non explicabo, deserunt, error magni ipsa qui
          provident odit dolores rerum incidunt pariatur natus officiis optio
          cumque dolore, ad nobis? Nam delectus enim quia dolore non architecto
          velit reprehenderit in accusamus saepe repellat veniam cum, debitis
          odio consectetur nisi est. Asperiores at tempore delectus perferendis,
          deleniti excepturi cumque tenetur fugit cum quibusdam commodi
          voluptate est alias facere ducimus dolorum placeat vitae possimus quia
          voluptatibus! Est pariatur tenetur ad dicta, aliquam praesentium ipsa
          laudantium itaque iusto rerum maiores expedita molestias obcaecati
          veritatis ratione, asperiores inventore perferendis tempore optio
          quae. Iusto saepe odit molestias cum illum nulla repudiandae
          laudantium ipsa! Incidunt eaque laborum doloribus itaque vitae.
          Consequatur, corporis sed. Omnis est animi, ab ut error impedit!
          Alias, nostrum pariatur, autem aliquam doloremque tempora quod, quo
          repudiandae est architecto assumenda facere officiis ipsam explicabo?
          Porro quidem culpa, necessitatibus ducimus minus voluptas ullam rem at
          quae optio? Odit quam libero voluptas culpa earum ab eaque aut
          perspiciatis aperiam ullam. A optio iusto ullam tenetur vitae incidunt
          laboriosam nobis, aliquid, quae quisquam perferendis, asperiores
          debitis dolores eaque voluptatum natus qui placeat praesentium quas ut
          nam accusantium deserunt unde cupiditate. Qui minus perspiciatis natus
          quas, aspernatur facilis dicta quae laboriosam omnis blanditiis cumque
          rerum quasi iure nisi molestiae labore, voluptatem odio! Corporis
          molestiae soluta magni porro vel placeat deserunt cumque architecto
          omnis repellendus reiciendis ab itaque laborum, dicta recusandae odio
          pariatur rem! Tenetur fugiat porro nihil sint ipsam. Labore sit
          voluptatibus dolore consectetur, amet nesciunt natus totam autem
          eveniet laboriosam dolores voluptatem cupiditate assumenda facilis
          soluta quam aliquam sed dolorem recusandae cum quia. Similique non
          repudiandae adipisci! Dignissimos nemo asperiores porro minus. Dolore
          ut velit, at fugiat porro quia in fugit quis exercitationem! Earum
          quasi beatae magnam illum tenetur? Animi repellat vel, quam quis
          perspiciatis architecto, a iste sunt molestias consequuntur optio!
          Nostrum quos incidunt aut? Eaque, accusamus? Earum quos assumenda
          voluptatum est quis delectus repudiandae sed reiciendis nobis, odio
          eveniet ipsa nihil velit omnis beatae minima nisi eaque sit esse
          placeat inventore saepe illo nam quo? Vitae voluptas sapiente commodi
          libero molestias eveniet illo voluptatem accusamus rem minus debitis
          corrupti nobis esse totam, impedit ea eum rerum corporis neque! Nihil
          rerum soluta asperiores consequuntur, eum ipsum consequatur, magni
          voluptates corrupti facere expedita officiis consectetur sapiente
          cupiditate. Dicta laborum ea assumenda eligendi corrupti impedit optio
          velit. Magnam sint, eaque, amet quasi fugit nam fuga esse qui quidem
          sit, voluptas reiciendis deleniti architecto ducimus non assumenda
          alias iste eum odit deserunt dignissimos ipsum sunt mollitia!
          Molestias, provident maiores aspernatur doloribus reiciendis ipsa
          sequi nesciunt libero cumque, quas cupiditate adipisci quod velit
          minus deserunt rem eum quae tempora perspiciatis voluptatibus ipsum.
          Sapiente, quod quis? Possimus eos dolorum, nam eum autem corrupti
          suscipit porro molestiae iste, doloremque, minus illo excepturi at
          repudiandae commodi tenetur cupiditate aliquam dignissimos. Hic
          deserunt similique maxime enim doloremque voluptatum voluptate dolor,
          aspernatur officiis beatae minima cumque in porro quod, nobis veniam
          nam repellendus! Saepe laborum nemo, molestias iste quis in placeat,
          vel reiciendis harum beatae ut repudiandae dignissimos sed quia
          perferendis rerum? Praesentium vero, in odit, sequi odio, aspernatur
          autem doloremque asperiores libero ea nesciunt provident minus.
          Architecto asperiores ut dolore suscipit tenetur explicabo blanditiis
          consectetur, facere tempore ullam, saepe nobis possimus minima
          voluptas molestiae quam unde impedit quod sed sapiente magni aut autem
          omnis. Reprehenderit quasi quidem consectetur magni, aliquam similique
          eum sint? Quisquam placeat minus harum dolor doloremque veritatis eum
          deleniti doloribus voluptates, quos exercitationem amet facere! Fugiat
          sed amet dolorum sint soluta perferendis, dolor saepe officia
          reprehenderit non sapiente dolores. Vero id eligendi debitis quod in?
          Nihil dignissimos nulla voluptas id provident mollitia, fugiat
          doloribus illo, architecto animi officia aperiam sunt temporibus?
          Commodi nesciunt dolorem iure perspiciatis amet repellendus est atque
          similique laboriosam architecto error recusandae quas repudiandae
          porro nobis velit, illum doloremque non. In non animi exercitationem
          accusantium libero illo odit expedita qui delectus, deleniti tempora
          optio molestias accusamus, quisquam nisi necessitatibus nulla minus
          deserunt rem omnis atque! Hic, eius? Id numquam necessitatibus nemo
          facilis. Enim nesciunt autem, distinctio at adipisci laboriosam
          reprehenderit voluptatum expedita atque consequatur suscipit quas quis
          esse? Magnam amet autem facere eos sequi dolorum eaque rem possimus
          veritatis voluptatem. Animi soluta, minima sed reiciendis ipsum
          numquam inventore delectus eos earum rem quae molestiae qui suscipit
          deserunt officia praesentium, eaque dolorum? Exercitationem
          consequuntur alias repellat maxime corporis doloremque, beatae amet
          labore, impedit dignissimos animi temporibus voluptatem dicta, minima
          quia iste omnis excepturi officiis et distinctio sit pariatur rerum
          fugiat! Culpa, ut. Ad distinctio facilis, numquam repellat iusto
          deserunt tempore veniam temporibus soluta voluptatem praesentium animi
          et at? Cumque, itaque natus sit repellendus nihil inventore blanditiis
          deserunt nemo impedit. Odio, sequi praesentium! Molestias enim
          obcaecati explicabo repellendus, quis amet minima numquam ipsa ad
          provident repudiandae reprehenderit, labore magni vitae voluptatum,
          eveniet mollitia eligendi necessitatibus recusandae! Sed esse soluta
          est voluptatibus architecto ipsam nam fugiat rerum fuga omnis maiores
          quae cupiditate quam aperiam corporis quos debitis hic ut sit natus,
          magni doloribus? Alias dignissimos iste laudantium! Atque cupiditate
          itaque soluta, nam quis ipsam ratione aut provident pariatur neque
          earum minima repudiandae placeat similique est nostrum ad eos, qui
          ipsum! Ex accusantium quaerat perspiciatis odio eveniet esse maxime
          quasi temporibus impedit harum numquam porro dolor, nulla placeat unde
          laudantium cupiditate veniam saepe amet velit. Placeat praesentium
          deserunt iusto corrupti, perspiciatis obcaecati sint maiores
          asperiores debitis tempore in molestiae fugit.
        </p>
      </div>

      {/* Radio Buttons for Agreement */}
      <div className="m-6">
        <label className="block m-6">
          <input
            type="radio"
            name="agreement"
            value="disagree"
            checked={!agreed}
            onChange={handleAgreementChange}
            className="m-1 "
          />
          I don't agree
        </label>
        <label className="block">
          <input
            type="radio"
            name="agreement"
            value="agree"
            checked={agreed}
            onChange={handleAgreementChange}
            className="m-2"
          />
          I agree
        </label>
      </div>

      <Button
        disabled={!agreed}
        sx={{
          width: "100%",
          py: 2,
          px: 2,
          borderRadius: "4px",
          backgroundColor: agreed ? "#4A3AFF" : "grey.300",
          color: agreed ? "white" : "grey.500",
          "&:hover": {
            backgroundColor: agreed ? "blue.600" : "grey.300",
          },
          cursor: agreed ? "pointer" : "not-allowed",
        }}
        component={Link}
        to="http://localhost:5173/exam/67d48b79a192985fb050eafc"
      >
        Continue
      </Button>
    </div>
  );
};

export default TermsAndConditions;
