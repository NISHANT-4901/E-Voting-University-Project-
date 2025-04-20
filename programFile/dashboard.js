document.addEventListener("DOMContentLoaded", () => {
  const candidates = document.querySelectorAll(".candidate");
  const voteBtn = document.getElementById("voteBtn");
  const resultBtn = document.getElementById("resultBtn");
  const resultModal = document.getElementById("resultModal");
  const closeModal = document.getElementById("closeModal");
  const resultContent = document.getElementById("resultContent");

  let selectedCandidate = null;

  // Initialize vote counts (in a real application, this would come from a database)
  const voteCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  // Handle candidate selection
  candidates.forEach((candidate) => {
    candidate.addEventListener("click", () => {
      // Remove selected class from all candidates
      candidates.forEach((c) => c.classList.remove("selected"));

      // Add selected class to clicked candidate
      candidate.classList.add("selected");

      // Update selected candidate
      selectedCandidate = candidate.dataset.candidate;

      // Enable vote button
      voteBtn.disabled = false;
    });
  });

  // Handle vote submission
  voteBtn.addEventListener("click", () => {
    if (selectedCandidate) {
      // Increment vote count for selected candidate
      voteCounts[selectedCandidate]++;

      // Disable all candidates and vote button
      candidates.forEach((candidate) => {
        candidate.style.pointerEvents = "none";
      });
      voteBtn.disabled = true;

    //   // Show success message
      alert("Your vote has been submitted successfully!");
    }
  });

  // Handle results display
  resultBtn.addEventListener("click", () => {
    // Find the winner (candidate with most votes)
    let maxVotes = 0;
    let winnerData = null;
    let otherCandidates = [];

    candidates.forEach((candidate) => {
      const candidateId = candidate.dataset.candidate;
      const candidateData = {
        id: candidateId,
        name: candidate.querySelector("h3").textContent,
        party: candidate.querySelector("p").textContent,
        votes: voteCounts[candidateId],
      };

      if (candidateData.votes > maxVotes) {
        if (winnerData) {
          otherCandidates.push(winnerData);
        }
        maxVotes = candidateData.votes;
        winnerData = candidateData;
      } else {
        otherCandidates.push(candidateData);
      }
    });

    // Generate results HTML
    let resultsHTML = '<div class="results-container">';

    // Add winner section
    resultsHTML += `
      <div class="winner-container">
        <h3>${winnerData.name}</h3>
        <p>${winnerData.party}</p>
        <div class="vote-count">${winnerData.votes} votes</div>
      </div>
    `;

    // Add other candidates
    if (otherCandidates.length > 0) {
      resultsHTML += '<div class="other-candidates">';
      otherCandidates.forEach((candidate) => {
        resultsHTML += `
          <div class="result-item">
            <h3>${candidate.name}</h3>
            <p>${candidate.party}</p>
            <div class="vote-count">${candidate.votes} votes</div>
          </div>
        `;
      });
      resultsHTML += "</div>";
    }

    resultsHTML += "</div>";

    // Update and show modal
    resultContent.innerHTML = resultsHTML;
    resultModal.style.display = "block";
  });

  // Close modal when clicking the close button
  closeModal.addEventListener("click", () => {
    resultModal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === resultModal) {
      resultModal.style.display = "none";
    }
  });
});
