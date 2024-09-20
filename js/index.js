let entries = JSON.parse(localStorage.getItem("entries")) || [];

function loadCountries() {
  fetch("https://restcountries.com/v3.1/all")
    .then(function (response) {
      return response.json();
    })
    .then(function (countries) {
      const select = document.getElementById("country");

      countries.forEach(function (country) {
        const option = document.createElement("option");
        option.value = country.name.common;
        option.textContent = country.name.common;
        select.appendChild(option);
      });
    })
    .catch(function (error) {
      console.error("Ошибка при загрузке стран:", error);
    });
}

document.getElementById("travel-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const country = document.getElementById("country").value;
  const date = document.getElementById("date").value;
  const message = document.getElementById("message").value;

  const newEntry = { country, date, message };
  saveEntry(newEntry);
});

function saveEntry(entry) {
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries();
  clearForm();
}

function renderEntries() {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  entries.forEach(function (entry, index) {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
      <h3>Запись #${index + 1}</h3>
      <p><strong>Страна:</strong> ${entry.country}</p>
      <p><strong>Дата:</strong> ${entry.date}</p>
      <p><strong>Сообщение:</strong> ${entry.message}</p>
      <button onclick="deleteEntry(${index})">Удалить</button>
      <button onclick="editEntry(${index})">Редактировать</button>
    `;
    postsDiv.appendChild(postDiv);
  });
}

function deleteEntry(index) {
  if (confirm("Вы действительно хотите удалить эту запись?")) {
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    renderEntries();
  }
}

function editEntry(index) {
  const entry = entries[index];
  document.getElementById("country").value = entry.country;
  document.getElementById("date").value = entry.date;
  document.getElementById("message").value = entry.message;

  entries.splice(index, 1); // Удаляем старую запись
  localStorage.setItem("entries", JSON.stringify(entries)); // Обновляем localStorage
  renderEntries();
}

function clearForm() {
  document.getElementById("country").value = "";
  document.getElementById("date").value = "";
  document.getElementById("message").value = "";
}

window.onload = function () {
  loadCountries();
  renderEntries();
};