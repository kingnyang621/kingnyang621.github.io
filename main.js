window.onload = function () {



    // 프로그램 시작
    log("main start");


    //함수 변경 버튼 코드
    document.getElementById(
        "changeButton"
    ).onclick = function () {

        let setup =

            document.getElementById(
                "setupContainer"
            );



        if (
            setup.style.display
            == "none"
        ) {

            setup.style.display =
                "block";

        }

        else {

            setup.style.display =
                "none";

        }

    };



    // 함수 만들기 버튼 클릭
    document.getElementById(

        "openButton"

    ).onclick = function () {



        // 설정창 생성
        createSetupPanel();



        // 모드 변경 이벤트
        document.getElementById(

            "modeSelect"

        ).onchange = function () {



            // 현재 모드 읽기
            graphMode =
                readGraphMode();



            // 기존 입력창 제거
            clearSetupInputs();



            // 함수 그래프 UI 생성
            if (
                graphMode
                == "function"
            ) {

                createFunctionUI();

                createPointCountInput();//한계지정

            }



            // 점화식 UI 생성
            if (
                graphMode
                == "sequence"
            ) {

                createSequenceUI();


                createPointCountInput();//한계지정



                document.getElementById(

                    "sequenceFormula"

                ).oninput = function () {



                    // -----------------
                    // 현재 점화식 읽기
                    // -----------------

                    let formula =
                        readSequenceFormula();



                    // -----------------
                    // 수열 이름 추출
                    // -----------------

                    let sequenceName =
                        extractSequenceName(
                            formula
                        );



                    // 이름 없으면 기본값
                    if (
                        sequenceName
                        == ""
                    ) {

                        sequenceName = "a";

                    }



                    // -----------------
                    // 점화식 차수 분석
                    // -----------------

                    let order =
                        analyzeSequenceOrder(
                            formula
                        );



                    // -----------------
                    // 초기값 입력창 HTML 생성
                    // -----------------

                    let html = "";



                    for (
                        let i = 0;
                        i < order;
                        i++
                    ) {

                        html += `

        <label>

            ${sequenceName}(${i})

        </label>

        <br>



        <input
            id="initial${i}"
            value="1"
        >

        <br><br>

        `;

                    }



                    // -----------------
                    // HTML 적용
                    // -----------------

                    document.getElementById(

                        "initialValueInputs"

                    ).innerHTML = html;

                };

            }



            // 그래프 생성 버튼
            document.getElementById(

                "createGraphButton"

            ).onclick = function () {

                createGraph();

            };

        };



        // 기본 모드 자동 실행
        document.getElementById(

            "modeSelect"

        ).onchange();

    };

};



// =====================
// 함수 저장 버튼
// =====================

document.getElementById(

    "saveFunctionButton"

).onclick = function () {



    // -----------------
    // 현재 작업 읽기
    // -----------------

    // 결과 예시:
    //
    // {
    //     mode : "function",
    //     formula : "x^2"
    // }

    let item =
        createCurrentItem();



    // -----------------
    // item이 존재하면
    // 목록에 추가
    // -----------------

    // JS에서:
    //
    // if(item)
    //
    // 은:
    //
    // item != null
    //
    // 느낌

    if (item) {


        // 배열 추가
        addItem(
            item
        );



        // 오른쪽 목록 다시 출력
        renderFunctionList();

    }

};


// =====================
// 함수 목록 클릭 이벤트
// =====================

document.getElementById(

    "functionListPanel"

).onclick = function (event) {




    // 실제 클릭된 HTML 요소
    let target =
        event.target;



    // -----------------
    // 삭제 버튼 클릭
    // -----------------

    if (

        target.classList.contains(

            "functionRemove"

        )

    ) {


        // 몇 번째 item인지 읽기
        let index =

            Number(

                target.dataset.index

            );



        // 배열 삭제
        removeItem(
            index
        );



        // 목록 다시 출력
        renderFunctionList();

    }


    // -----------------
    // 함수 선택
    // -----------------

    if (

        target.classList.contains(

            "functionSelect"

        )

    ) {


        // -----------------
        // 몇 번째 item인지 읽기
        // -----------------

        let index =

            Number(

                target.dataset.index

            );



        // -----------------
        // item 읽기
        // -----------------

        let item =
            readItem(
                index
            );



        // -----------------
        // setup panel 생성
        // -----------------

        createSetupPanel();



        // -----------------
        // mode 설정
        // -----------------

        document.getElementById(

            "modeSelect"

        ).value =

            item.mode;



        // -----------------
        // mode onchange 실행
        // -----------------

        document.getElementById(

            "modeSelect"

        ).onchange();



        // -----------------
        // mode onchange 실행
        // -----------------

        document.getElementById(

            "modeSelect"

        ).onchange();



        // -----------------
        // 함수 모드
        // -----------------

        if (item.mode == "function") {


            // 저장된 식 복원
            document.getElementById(

                "formula"

            ).value =

                item.formula;

        }



        // -----------------
        // 점화식 모드
        // -----------------

        if (item.mode == "sequence") {


            // 저장된 식 복원
            document.getElementById(

                "sequenceFormula"

            ).value =

                item.formula;



            // =====================
            // 초기값 복원
            // =====================

            for (

                let i = 0;

                i < item.initialValues.length;

                i++

            ) {

                let input =

                    document.getElementById(

                        `initial${i}`

                    );



                if (input) {

                    input.value =

                        item.initialValues[i];

                }

            }

        }



        // =====================
        // pointCount 복원
        // =====================

        document.getElementById(

            "pointCount"

        ).value =

            item.pointCount;



        // =====================
        // sliderValues 복원
        // =====================

        sliderValues =

            structuredClone(

                item.sliderValues

            );


        createGraph();

    }

};


// =====================
// 피보나치 프리셋
// =====================

document.getElementById(

    "presetFibonacci"

).onclick = function () {


    createSetupPanel();



    document.getElementById(

        "modeSelect"

    ).value = "sequence";



    graphMode = "sequence";



    clearSetupInputs();



    createSequenceUI();



    createPointCountInput();



    let formula =

        "a(n-1)+a(n-2)";



    document.getElementById(

        "sequenceFormula"

    ).value = formula;



    // 초기값 입력창 생성
    let order =

        analyzeSequenceOrder(
            formula
        );



    let html = "";



    for (

        let i = 0;

        i < order;

        i++

    ) {

        html += `

<label>
a(${i})
</label>

<br>

<input
    id="initial${i}"
    value="1"
>

<br><br>

`;

    }



    document.getElementById(

        "initialValueInputs"

    ).innerHTML = html;



    let input0 =
        document.getElementById("initial0");

    let input1 =
        document.getElementById("initial1");



    if (input0) input0.value = 1;

    if (input1) input1.value = 1;



    createGraph();



    connectSequenceSliders(
        formula
    );

};



// =====================
// 멜서스 프리셋
// =====================

document.getElementById(

    "presetMalthus"

).onclick = function () {


    createSetupPanel();



    document.getElementById(

        "modeSelect"

    ).value = "sequence";



    graphMode = "sequence";



    clearSetupInputs();



    createSequenceUI();



    createPointCountInput();



    let formula =

        "(1+r)*N(n-1)";



    document.getElementById(

        "sequenceFormula"

    ).value = formula;



    let order =

        analyzeSequenceOrder(
            formula
        );



    let html = "";



    for (

        let i = 0;

        i < order;

        i++

    ) {

        html += `

<label>
N(${i})
</label>

<br>

<input
    id="initial${i}"
    value="1"
>

<br><br>

`;

    }



    document.getElementById(

        "initialValueInputs"

    ).innerHTML = html;



    let input0 =
        document.getElementById("initial0");



    if (input0) {

        input0.value = 10;

    }



    sliderValues.r = 0.08;



    createGraph();



    connectSequenceSliders(
        formula
    );

};



// =====================
// 로지스틱 프리셋
// =====================

document.getElementById(

    "presetLogistic"

).onclick = function () {


    createSetupPanel();



    document.getElementById(

        "modeSelect"

    ).value = "sequence";



    graphMode = "sequence";



    clearSetupInputs();



    createSequenceUI();



    createPointCountInput();



    let formula =

        "x(n-1)+r*x(n-1)*(1-(x(n-1)/K))";



    document.getElementById(

        "sequenceFormula"

    ).value = formula;



    let order =

        analyzeSequenceOrder(
            formula
        );



    let html = "";



    for (

        let i = 0;

        i < order;

        i++

    ) {

        html += `

<label>
x(${i})
</label>

<br>

<input
    id="initial${i}"
    value="1"
>

<br><br>

`;

    }



    document.getElementById(

        "initialValueInputs"

    ).innerHTML = html;



    let input0 =
        document.getElementById("initial0");



    if (input0) {

        input0.value = 10;

    }



    sliderValues.r = 0.08;

    sliderValues.K = 100;



    createGraph();



    connectSequenceSliders(
        formula
    );

};



// =====================
// 창작모델 1
// =====================

document.getElementById(

    "presetCustom1"

).onclick = function () {


    createSetupPanel();



    document.getElementById(

        "modeSelect"

    ).value = "sequence";



    graphMode = "sequence";



    clearSetupInputs();



    createSequenceUI();



    createPointCountInput();



    let formula =

        "((N(n-1)-N(n-d-1))*r)+N(n-1)-c*N(n-x-1)";



    document.getElementById(

        "sequenceFormula"

    ).value = formula;



    let html = "";



    for (

        let i = 0;

        i < 15;

        i++

    ) {

        html += `

<label>
N(${i})
</label>

<br>

<input
    id="initial${i}"
    value="${10+i}"
>

<br><br>

`;

    }



    document.getElementById(

        "initialValueInputs"

    ).innerHTML = html;



    sliderValues.r = 0.03;

    sliderValues.d = 2;

    sliderValues.x = 12;

    sliderValues.c = 0.003;



    createGraph();



    connectSequenceSliders(
        formula
    );

};



// =====================
// 창작모델 2
// =====================

document.getElementById(

    "presetCustom2"

).onclick = function () {


    createSetupPanel();



    document.getElementById(

        "modeSelect"

    ).value = "sequence";



    graphMode = "sequence";



    clearSetupInputs();



    createSequenceUI();



    createPointCountInput();



    let formula =

        "((N(n-1)-N(n-d-1))*r*(1-(N(n-1)/K)))+N(n-1)-c*N(n-x-1)";



    document.getElementById(

        "sequenceFormula"

    ).value = formula;



    let html = "";



    for (

        let i = 0;

        i < 15;

        i++

    ) {

        html += `

<label>
N(${i})
</label>

<br>

<input
    id="initial${i}"
    value="${10+i}"
>

<br><br>

`;

    }



    document.getElementById(

        "initialValueInputs"

    ).innerHTML = html;



    sliderValues.r = 0.08;

    sliderValues.d = 2;

    sliderValues.x = 12;

    sliderValues.K = 100;

    sliderValues.c = 0.005;



    createGraph();



    connectSequenceSliders(
        formula
    );

};


document.getElementById(

    "clearGraphsButton"

).onclick = function () {

    graphCollection = [];



    let canvas =

        document.getElementById(

            "myChart"

        );



    let ctx =

        canvas.getContext("2d");



    ctx.clearRect(

        0,
        0,
        canvas.width,
        canvas.height

    );

};