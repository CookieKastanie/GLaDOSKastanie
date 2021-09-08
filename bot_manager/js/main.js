$(window).on("load", () => {
  $('#authModal').modal('show');

  //document.getElementById("auth").value = "...";
  //authForm.onsubmit();
});


$(function () {
  $('#datetimepicker1').datetimepicker();
});


const handleStatus = res => {
  if(res.status == 401) $('#failAuthModal').modal('show');
}

const apiUrl = `${window.location.protocol}//${window.location.hostname}:4000`;
const refreshAuthBtn = document.getElementById("refreshAuthBtn");
const authForm = document.getElementById("authForm");
const failAuthBtn = document.getElementById("failAuthBtn");
const sayOnForm = document.getElementById("sayOnForm");
const rdvModal = document.getElementById("rdvModal");

let getAuth = () => {
  return "";
}

refreshAuthBtn.onclick = () => {
  fetch(`${apiUrl}/refreshAuth`, {
    method: 'GET',
    headers: {'Authorization': getAuth()}
  }).then(res => {
    handleStatus(res);
    location.reload();
  });
}


const getCanaux = () => {
  fetch(`${apiUrl}/canaux`, {
    method: 'GET',
    headers: {'Authorization': getAuth()}
  }).then(res => {
    handleStatus(res);
    return res.json();
  }).then(canaux => {
    const canauxSelectors = document.getElementsByClassName("canauxSelector");

    for (let canauxSelector of canauxSelectors) {
      for (let c of canaux.text) {
        const option = document.createElement("option");

        option.value = c;
        option.innerHTML = c;

        canauxSelector.appendChild(option);
      }
    }
  });
}




authForm.onsubmit = () => {
  const auth = document.getElementById("auth").value;

  getAuth = () => {
    return auth;
  }

  $('#authModal').modal('hide');

  getCanaux();

  return false;
}

failAuthBtn.onclick = () => {
  location.reload();
}

sayOnForm.onsubmit = () => {
  const canal = document.getElementById("channel").value;
  const msg = document.getElementById("msg").value;
  const delay = document.getElementById("delay").value;

  const data = {
    channel: canal,
    msg: msg,
    delay: delay
  }

  fetch(`${apiUrl}/sayOn`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': getAuth()},
    body: JSON.stringify(data)
  }).then(res => {
    handleStatus(res);
  });

  $('#sayModal').modal('hide');

  return false;
}


rdvModal.onsubmit = () => {
  const canal = document.getElementById("rdvChannel").value;
  const rdvSujet = document.getElementById("rdvSujet").value;
  const rdvDesc = document.getElementById("rdvDesc").value;
  const rvdDate = document.getElementById("rvdDate").value;

  let d = $("#datetimepicker1").data("DateTimePicker").date().toDate();

  let data = {
    canal: canal,
    sujet: rdvSujet,
    description: rdvDesc,
    date: d.getTime()
  }

  fetch(`${apiUrl}/reunion`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': getAuth()},
    body: JSON.stringify(data)
  }).then(res => {
    handleStatus(res);
  });

  $('#rdvModal').modal('hide');

  return false;
}
