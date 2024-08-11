document.getElementById('checkProxiesForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const proxyList = document.getElementById('proxyList').value.trim();
    const proxies = proxyList.split('\n').map(proxy => proxy.trim()).filter(proxy => proxy);

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    try {
        const response = await fetch('/check-proxies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ proxies })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const results = await response.json();

        results.forEach(result => {
            resultsContainer.innerHTML += `<div>Proxy ${result.proxy} - Speed: ${result.speed} - Status: ${result.status}</div>`;
        });
    } catch (error) {
        resultsContainer.innerHTML += `<div>Error: ${error.message}</div>`;
    }
});
