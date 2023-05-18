const weatherState=document.querySelector(".weatherState");
const loading=document.querySelector(".loading");
const inputSearch=document.querySelector("#inputSearch");
const search=document.querySelector("#search");
const api_key="8JQ5S7BGMG3Z7469MWJ2QRJ2G";
const link="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
const cityApi="https://api.teleport.org/api/urban_areas/slug:";
let loc="";
let color="";
let cityName="";

search.addEventListener("click",(e)=>{
    e.preventDefault();
    loc=inputSearch.value;
    weatherState.innerHTML="";
    inputSearch.value="";
    loading.classList.remove("hide");
    fetchApi(link);
    
});

async function fetchApi(link){
    const response=await fetch(link+loc+"?unitGroup=metric&key="+api_key+"&contentType=json");

    if(response.ok){
        const data=await response.json();
        showWeatherState(data);
        fetchCity(cityApi,cityName.toLocaleLowerCase());
    }else{
        loading.classList.add("hide");
        newError("Geçerli bir şehir giriniz.");
    }
    
};

async function fetchCity(cityApi,loc){
    const response=await fetch(cityApi+loc+"/images/");
    if(response.ok){
        const data= response.json();
        data.then(d=>{
            const image=d.photos[0].image.mobile;
            document.body.style.backgroundImage=`url('${image}')`;
        });  
    }else {
        document.body.style.backgroundImage=`url("./img/background.jpg")`;
    }
}

const newError=(err)=>{
    weatherState.innerHTML=`<h6 class="alert alert-danger">${err}</h6>`
}

const showWeatherState=(data)=>{
    cityName=formatName(data.timezone);
    const html=`<h3>Weather in ${cityName}</h3>
                <h2>${data.currentConditions.temp} &#8451;</h2>
                <h6><span class="circleColor"></span>${data.currentConditions.conditions}</h6>
                <h6>Humidity: ${data.currentConditions.humidity}%</h6>
                <h6>Wind speed: ${data.currentConditions.windspeed} km/h</h6>`;
    loading.classList.add("hide");
    weatherState.innerHTML=html;
    color=document.querySelector(".circleColor");
    circleColor(data.currentConditions.conditions);
}

const circleColor=(weatherCondition)=>{
    switch (weatherCondition) {
        case "Clear":
            color.style.backgroundColor="yellow";
            break;
        case "Partially cloudy":
            color.style.backgroundColor="#3980cb";
        break;
        case "Overcast":
            color.style.backgroundColor="darkgray";
            break;    
        default:
            color.style.backgroundColor="white";
            break;
    }
}

const formatName=(city)=>{
    let divideName=city.split("/");
    return divideName[1];
}
