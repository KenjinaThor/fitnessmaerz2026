function render(){
  const day=state.date.getDate();
  const pattern=ROTATION[(day-1)%ROTATION.length];
  const key=dayKey(state.date);

  if(!state.progress[key]) state.progress[key]={};

  document.getElementById("dateText").textContent=formatDate(state.date);
  document.getElementById("dayChip").textContent="Tag "+pattern;
  document.getElementById("weekChip").textContent=getWeekSeconds(day)+" Sek";

  if(pattern==="Pause"){
    document.getElementById("content").innerHTML=
      "<div>Erholungstag – 10 Minuten Spaziergang.</div>";
    return;
  }

  const list=DAY_PATTERNS[pattern];

  // Falls Index groesser als Liste (z.B. neuer Tag)
  if(state.index >= list.length){
    state.index = list.length - 1;
  }

  const ex=list[state.index];
  const exData=EXERCISES[ex];

  const doneCount=Object.values(state.progress[key]).filter(Boolean).length;
  const pct=Math.round((doneCount/list.length)*100);

  document.getElementById("barFill").style.width=pct+"%";
  document.getElementById("pctText").textContent=pct+"%";
  document.getElementById("statusChip").textContent=pct===100?"geschafft":"offen";

  document.getElementById("content").innerHTML=`
    <div class="exerciseCard">
      <div class="exName">${exData.name}</div>
      <div class="exHint">${exData.hint}</div>
      <a class="videoBtn" href="${exData.video}" target="_blank">▶ Video</a>

      <div class="checkRow">
        <label>
          <input type="checkbox" id="doneBox" ${state.progress[key][ex]?"checked":""}>
          erledigt
        </label>
        <div>${state.index+1}/${list.length}</div>
      </div>

      <div style="margin-top:12px;display:flex;justify-content:space-between;">
        <button id="prevBtn" ${state.index===0?"disabled":""}>Zurück</button>
        <button id="nextBtn" ${state.index===list.length-1?"disabled":""}>Nächste</button>
      </div>
    </div>
  `;

  // Checkbox Logik
  document.getElementById("doneBox").onchange=function(){
    state.progress[key][ex]=this.checked;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state.progress));

    // Automatisch zur naechsten Übung springen
    if(this.checked && state.index < list.length-1){
      state.index++;
    }

    render();
  };

  // Navigation Buttons
  document.getElementById("prevBtn").onclick=()=>{
    if(state.index>0){
      state.index--;
      render();
    }
  };

  document.getElementById("nextBtn").onclick=()=>{
    if(state.index<list.length-1){
      state.index++;
      render();
    }
  };
}