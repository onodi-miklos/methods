fetch('/data')
  .then(response => response.json())
  .then(json => {
    const resultDiv = document.getElementById('result')
    resultDiv.textContent = JSON.stringify(json, null, 2)
  })
  .catch(err => {
    console.error(err)
  })
