document.addEventListener('DOMContentLoaded', () => {
    const eventNameElement = document.getElementById('event-name');
    const scheduleContainer = document.getElementById('schedule-container');
    const searchBar = document.getElementById('search-bar');

    let talksData = [];

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            talksData = data.talks;
            eventNameElement.textContent = data.eventName;
            renderSchedule(talksData);
        });

    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTalks = talksData.filter(talk => 
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talks) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0);

        talks.forEach((talk, index) => {
            const startTime = new Date(currentTime);
            const endTime = new Date(startTime.getTime() + talk.duration * 60000);

            const talkCard = document.createElement('div');
            talkCard.classList.add('talk-card');

            const timeString = `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

            talkCard.innerHTML = `
                <h3>${timeString}</h3>
                <h2>${talk.title}</h2>
                <p class="speakers">${talk.speakers.join(', ')}</p>
                <p class="category">${talk.category.join(', ')}</p>
                <p class="description">${talk.description}</p>
            `;
            scheduleContainer.appendChild(talkCard);

            currentTime = new Date(endTime.getTime() + 10 * 60000);

            if (index === 2) {
                const lunchBreak = document.createElement('div');
                lunchBreak.classList.add('break-card');
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
                const lunchTimeString = `${lunchStartTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${lunchEndTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                lunchBreak.innerHTML = `<h3>${lunchTimeString}</h3><h2>Lunch Break</h2>`;
                scheduleContainer.appendChild(lunchBreak);
                currentTime = new Date(lunchEndTime.getTime() + 10 * 60000);
            }
        });
    }
});
