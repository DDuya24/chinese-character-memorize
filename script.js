document.addEventListener('DOMContentLoaded', function() {
    const buttonContainer = document.getElementById('button-container');
    const subjectTitle = document.getElementById('subject-title');
    const subTitle = document.getElementById('sub-title');
    let currentIndex = 0;
    let currentSubjectNumber = 1;
    let hanjaList = [];
    let usedIndexes = []; // 이미 출제된 한자의 인덱스를 저장
    let mode = ""; // 현재 모드 (암기 또는 테스트)

    // 과 선택 버튼 생성
    for (let i = 1; i <= 25; i++) {
        const button = document.createElement('button');
        button.classList.add('hanja-button');
        button.textContent = `${i}과`;
        button.onclick = function() {
            subjectTitle.textContent = `${i}과`;
            subTitle.textContent = '학습 선택 (AI 사용으로 옳지 않은 한자 있을 수 있음)';
            currentSubjectNumber = i;
            hanjaList = hanja_data[`${i}과`];
            showStudyButtons();
        };
        buttonContainer.appendChild(button);
    }

    // 학습 선택 버튼 표시
    function showStudyButtons() {
        buttonContainer.innerHTML = '';
        const studyButtons = ['암기', '테스트', '뒤로 가기'];

        studyButtons.forEach(buttonText => {
            const button = document.createElement('button');
            button.classList.add('hanja-button');
            button.textContent = buttonText;
            button.onclick = function() {
                if (buttonText === '뒤로 가기') {
                    resetSubjectSelection();
                } else if (buttonText === '암기') {
                    mode = "memorize";
                    startMemorizeMode();
                } else if (buttonText === '테스트') {
                    mode = "test";
                    startHanjaTest();
                }
            };
            buttonContainer.appendChild(button);
        });
    }

    // 과목 선택 페이지로 돌아가기
    function resetSubjectSelection() {
        subjectTitle.textContent = '과목 선택';
        subTitle.textContent = '과목을 선택하세요';
        buttonContainer.innerHTML = '';
        mode = "";
        for (let i = 1; i <= 25; i++) {
            const button = document.createElement('button');
            button.classList.add('hanja-button');
            button.textContent = `${i}과`;
            button.onclick = function() {
                subjectTitle.textContent = `${i}과`;
                subTitle.textContent = '학습 선택';
                currentSubjectNumber = i;
                hanjaList = hanja_data[`${i}과`];
                showStudyButtons();
            };
            buttonContainer.appendChild(button);
        }
    }

    // 암기 모드 시작
    function startMemorizeMode() {
        buttonContainer.innerHTML = '';
        currentIndex = 0; // 첫 번째 한자로 시작
        displayHanjaMemorize();
    }

    // 암기 모드 화면 표시
    function displayHanjaMemorize() {
        buttonContainer.innerHTML = '';

        // 한자 표시
        const hanjaDisplay = document.createElement('div');
        hanjaDisplay.classList.add('hanja-display');
        hanjaDisplay.textContent = hanjaList[currentIndex].hanja;
        buttonContainer.appendChild(hanjaDisplay);

        // 뜻과 음 표시
        const meaningText = document.createElement('div');
        meaningText.classList.add('meaning');
        meaningText.textContent = `뜻: ${hanjaList[currentIndex].meaning}`;
        buttonContainer.appendChild(meaningText);

        const readingText = document.createElement('div');
        readingText.classList.add('reading');
        readingText.textContent = `음: ${hanjaList[currentIndex].reading}`;
        buttonContainer.appendChild(readingText);

        // 다음 한자 또는 학습 종료 링크
        const nextLink = document.createElement('div');
        nextLink.classList.add('small-link');
        nextLink.textContent = currentIndex < hanjaList.length - 1 ? '다음 한자로' : '학습 종료';
        nextLink.onclick = function() {
            if (currentIndex < hanjaList.length - 1) {
                currentIndex++;
                displayHanjaMemorize();
            } else {
                showStudyButtons();
            }
        };
        buttonContainer.appendChild(nextLink);

        // 메인 페이지로 링크
        const mainLink = document.createElement('div');
        mainLink.classList.add('small-link');
        mainLink.textContent = '메인 페이지로';
        mainLink.onclick = resetSubjectSelection;
        buttonContainer.appendChild(mainLink);
    }

    // 테스트 모드 시작
    function startHanjaTest() {
        buttonContainer.innerHTML = '';
        usedIndexes = []; // 이전에 출제된 한자 인덱스를 초기화
        getNextHanjaForTest();
    }

    // 새로운 한자 출제 (중복되지 않도록)
    function getNextHanjaForTest() {
        if (usedIndexes.length === hanjaList.length) {
            showStudyButtons(); // 모든 한자가 출제되었으면 학습 선택 화면으로 돌아가기
            return;
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * hanjaList.length);
        } while (usedIndexes.includes(randomIndex)); // 이미 출제된 한자는 제외

        usedIndexes.push(randomIndex);
        currentIndex = randomIndex;
        displayHanjaTest();
    }

    // 테스트 모드 화면 표시
    function displayHanjaTest() {
        buttonContainer.innerHTML = '';

        // 한자 표시
        const hanjaDisplay = document.createElement('div');
        hanjaDisplay.classList.add('hanja-display');
        hanjaDisplay.textContent = hanjaList[currentIndex].hanja;
        buttonContainer.appendChild(hanjaDisplay);

        // 뜻과 음 입력 필드
        const meaningInput = document.createElement('input');
        meaningInput.classList.add('input-field');
        meaningInput.placeholder = '뜻을 입력하세요';
        buttonContainer.appendChild(meaningInput);

        const readingInput = document.createElement('input');
        readingInput.classList.add('input-field');
        readingInput.placeholder = '음을 입력하세요';
        buttonContainer.appendChild(readingInput);

        // 정답 확인 버튼
        const checkAnswerButton = document.createElement('button');
        checkAnswerButton.classList.add('check-answer');
        checkAnswerButton.textContent = '정답 확인';
        checkAnswerButton.disabled = true;
        buttonContainer.appendChild(checkAnswerButton);

        // 메인 페이지로 링크
        const mainLink = document.createElement('div');
        mainLink.classList.add('small-link');
        mainLink.textContent = '메인 페이지로';
        mainLink.onclick = resetSubjectSelection;
        buttonContainer.appendChild(mainLink);

        // 입력 필드 값 변경 시 정답 확인 버튼 활성화
        function updateCheckAnswerButton() {
            checkAnswerButton.disabled = !meaningInput.value || !readingInput.value;
        }
        meaningInput.addEventListener('input', updateCheckAnswerButton);
        readingInput.addEventListener('input', updateCheckAnswerButton);

        // Enter 키를 눌렀을 때 정답 확인 버튼 클릭
        meaningInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                checkAnswerButton.click();
            }
        });
        readingInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                checkAnswerButton.click();
            }
        });

        // 정답 확인 클릭 시 채점
        checkAnswerButton.onclick = function() {
            const correctMeaning = hanjaList[currentIndex].meaning.split(','); // 쉼표로 분리된 뜻들
            const correctReading = hanjaList[currentIndex].reading;
            const userMeaning = meaningInput.value.trim();
            const userReading = readingInput.value.trim();

            // 뜻 비교: 쉼표로 구분된 여러 뜻 중 하나라도 맞으면 정답
            const meaningCorrect = correctMeaning.some(meaning => userMeaning.includes(meaning.trim()));
            const readingCorrect = userReading === correctReading;

            // 정답 표시
            meaningInput.value = meaningCorrect ? `${userMeaning} (정답)` : `${userMeaning} (오답, 정답: ${correctMeaning.join(', ')})`;
            readingInput.value = readingCorrect ? `${userReading} (정답)` : `${userReading} (오답, 정답: ${correctReading})`;

            checkAnswerButton.textContent = usedIndexes.length < hanjaList.length ? '다음 한자로' : '학습 종료';

            checkAnswerButton.onclick = function() {
                getNextHanjaForTest();
            };
        };
    }
});
