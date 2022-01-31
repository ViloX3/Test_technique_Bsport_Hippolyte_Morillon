import { useEffect, useState } from "react/cjs/react.development";
import "./case.css"
import Reservation from "../reservation/reservation";

function Case(props) {
    const values = props.values;
    const day = props.date;
    const coachs = props.coachs;
    const establishments = props.establishments;
    const activities = props.activities;

    //coach

    function getCoach(id) {
        for (var coach of coachs) {
            if (coach.id == id) {
                return coach.user;
            }
        }
        return null
    }

    //activity

    function getActivity(id) {
        for (var activity of activities) {
            if (activity.id == id) {
                return activity;
            }
        }
        return null
    }

    //establishment

    function getEstablishment(id) {
        for (var establishment of establishments) {
            if (establishment.id == id) {
                return establishment;
            }
        }
        return null
    }

    return (
        <div class="case">
            <h2>{day}</h2>
            <div class="reservationContents">
                {values.map((res) => (
                    <Reservation key={res.id} reservationInfo={res} coach={getCoach(res.coach)} activity={getActivity(res.meta_activity)} establishment={getEstablishment(res.establishment)} />
                ))}
            </div>
        </div>
    );
}

export default Case