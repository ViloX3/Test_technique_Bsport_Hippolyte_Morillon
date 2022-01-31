import { useEffect, useState } from "react/cjs/react.development";
import "./reservation.css"

function Reservation(props) {
    /* const id_coach = props.reservationInfo.coach; */
    const level = props.reservationInfo.level;
    const coach = props.coach;
    const activity = props.activity;
    const establishment = props.establishment;
    const [member, updateMember] = useState(null)
    const [isOnHover, updateIsOnHover] = useState(false)

    function getMember() {
        console.log("member")
        fetch("https://api.staging.bsport.io/api/v1/member/?company=6&offer="+props.reservationInfo.id, {
            "method": "GET",
            "headers": {"Authorization": "Token f18688960a8942c83d238b04e88389ac126bf55c"}
        })
        .then(response => response.json())
        .then(response => {
            if (response.results[0] == null){
                updateMember({});
            }
            else {
                console.log("yes");
                updateMember(response.results[0]);
            }
        })
        .catch(err => { console.log(err); 
        });
    }

    function showMemberOnHover() {
        if(member == null) {
            getMember();
        }
        updateIsOnHover(true);
    }

    return <div class="reservation" 
                    onMouseEnter={() => showMemberOnHover()} 
                    onMouseLeave={() => updateIsOnHover(false)}>
                {activity != null && (<div><div>Activity: {activity.name}</div> <img src={activity.cover_main} /></div>)}
                <div>Level: {level}</div>
                {establishment != null && <div><div>Place: {establishment.title}</div> {isOnHover && <img src={establishment.cover} />}</div>}
                {coach != null && <div><div>Coach: {coach.name}</div> {isOnHover && <img src={coach.photo} />} </div> }
                {isOnHover && member != null && <div><div>Member: {member.name}</div><img src={member.photo} /></div>}
            </div>
}

export default Reservation
