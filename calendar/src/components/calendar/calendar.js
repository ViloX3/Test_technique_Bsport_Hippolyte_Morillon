import "./calendar.css";
import { useEffect, useState } from "react";
import Case from "../case/case";


function Calendar() {
    console.log("start");

    const [date, updateDate] = useState({year: 2021, month: 12});
    const [planning, updatePlanning] = useState([]);
    const [coachs, updateCoachs] = useState([]);
    const [establishments, updateEstablishments] = useState([]);
    const [activities, updateActivities] = useState([]);

    
    function getPlanning() {
        console.log("getPlanning")
        let min_date = date.year+"-"+date.month+"-01";
        let max_date = date.year+"-"+(date.month+1)+"-01"
        if(date.month == 12){
            max_date = (date.year+1)+"-01-01"
        }
        fetch("https://api.staging.bsport.io/api/v1/offer/?company=6&min_date="+min_date+"&max_date="+max_date+"&page_size=500", {
            "method": "GET",
            "headers": {"Authorization": "Token f18688960a8942c83d238b04e88389ac126bf55c"}
        })
        .then(response => response.json())
        .then(response => {
            let formatRes = formatResu(response.results);
            let calendar = []
            for(let i = 1; i<32; i++) {
                calendar.push({id: i, value: []});
            }
            for(var key in formatRes) {
                calendar[parseInt(key[8] + key[9])-1]["value"] = formatRes[key];
            }
            updatePlanning(calendar);
        })
        .catch(err => { console.log(err); 
        });
    }

    function formatResu(res) {
        let calendar = {}
        for (let elem of res) {
            elem["date"] = lecDate(elem.date_start);
            if (calendar[elem.date] == null) {
                calendar[elem.date] = [elem];
            }
            else {
                calendar[elem.date].push(elem);
            }
        }
        return calendar
    }

    function lecDate(date) {
        let dateFormated = ""
        for (let letter of date) {
            if (letter=="T") {
                return dateFormated
            }
            dateFormated += letter
        }
        return "error"
    }

    function nextweek() {
        let newDate = {year: date.year, month:date.month+1}
        if (date.month == 12){
            newDate.year += 1;
            newDate.month = 1;
        }
        updateDate(newDate)
    }

    function previousweek() {
        let newDate = {year: date.year, month:date.month-1}
        if (date.month == 1){
            newDate.year -= 1;
            newDate.month = 12;
        }
        updateDate(newDate)
    }

    function getCoachs() {
        let idsCoachs = []
        for (var day of planning) {
            for (var reservation of day.value) {
                if(!(idsCoachs.includes(reservation.coach))) {
                    idsCoachs.push(reservation.coach);
                }
            }
        }
        let idsCoachsString = ""
        for (var id of idsCoachs) {
            idsCoachsString += id+",";
        }
        if (idsCoachsString != "") {
            console.log('getCoachs');
            fetch("https://api.staging.bsport.io/api/v1/coach/?company=6&id__in="+idsCoachsString, {
                "method": "GET",
                "headers": {"Authorization": "Token f18688960a8942c83d238b04e88389ac126bf55c"}
            })
            .then(response => response.json())
            .then(response => {
                console.log(response.results)
                updateCoachs(response.results)
            })
            .catch(err => { console.log(err); 
            });
        }
    }

    function getEstablishments() {
        let idsEstablishments = []
        for (var day of planning) {
            for (var reservation of day.value) {
                if(!(idsEstablishments.includes(reservation.establishment))) {
                    idsEstablishments.push(reservation.establishment);
                }
            }
        }
        let idsEstablishmentsString = ""
        for (var id of idsEstablishments) {
            idsEstablishmentsString += id+",";
        }
        if (idsEstablishmentsString != "") {
            console.log('getEstablishments');
            fetch("https://api.staging.bsport.io/api/v1/establishment/?company=6&id__in="+idsEstablishmentsString, {
                "method": "GET",
                "headers": {"Authorization": "Token f18688960a8942c83d238b04e88389ac126bf55c"}
            })
            .then(response => response.json())
            .then(response => {
                updateEstablishments(response.results)
            })
            .catch(err => { console.log(err); 
            });
        }
    }

    function getActivities() {
        let idsActivities = []
        for (var day of planning) {
            for (var reservation of day.value) {
                if(!(idsActivities.includes(reservation.meta_activity))) {
                    idsActivities.push(reservation.meta_activity);
                }
            }
        }
        let idsActivitiesString = ""
        for (var id of idsActivities) {
            idsActivitiesString += id+",";
        }
        if (idsActivitiesString != "") {
            console.log('getActivities');
            fetch("https://api.staging.bsport.io/api/v1/meta-activity/?company=6&id__in="+idsActivitiesString, {
                "method": "GET",
                "headers": {"Authorization": "Token f18688960a8942c83d238b04e88389ac126bf55c"}
            })
            .then(response => response.json())
            .then(response => {
                updateActivities(response.results)
            })
            .catch(err => { console.log(err); 
            });
        }
    }

    /* useEffect(() => {
        getPlanning();
    }, []) */

    useEffect(() => {
        getPlanning();
    }, [date]);

    useEffect(() => {
        getCoachs();
        getEstablishments();
        getActivities();
    }, [planning])

    
    console.log(planning);
    console.log("end");
    return (
        <div class="calendar">
            <h1> {date.month}/{date.year} </h1>
            <button onClick={() => previousweek()}>Previous Week</button>
            <button onClick={() => nextweek()}>Next Week</button>
            <container> 
                {planning.map((day) => (
                    <Case key={day.id} values={day.value} date={day.id} establishments={establishments} coachs={coachs} activities={activities} />
                ))}
            </container>
        </div>
    );
}

export default Calendar;