import React from "react";
import './css/admin.css';
import Title from "./title";
import StatusList from "./StatusList";
import FilialList from "./FilialList";
import Settings from "./Settings";
import Weight from "./Weight"
import Banners from "./Banners"
import Contacts from "./Contacts";
const MyCargo = () => {

    return (
      
        <div className="my-cargo mainAdmin">
            <Title text="Мой карго"/>
            <div className="section-my-cargo">
                <Settings/>
                <div className="my-cargo-flex2">
                    <Weight/>
                    <Contacts/>
                </div>
            </div>
            <div className="section-my-cargo">
                <Banners/>

            </div>
            <div className="section-my-cargo">
                <StatusList/>
                <FilialList/>

            </div>


        </div>

    )
}

export default MyCargo;