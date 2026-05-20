// =====================
// 공용 유틸 함수
// =====================

function log(functionName) {

    console.log(
        `${functionName} 실행`
    );

}



// =====================
// 입력 읽기 함수
// =====================

function readGraphMode() {

    log(
        "readGraphMode"
    );



    return document.getElementById(
        "modeSelect"
    ).value;

}



function readFunctionFormula() {

    log(
        "readFunctionFormula"
    );



    return document.getElementById(
        "formula"
    ).value;

}



function readSequenceFormula() {

    log(
        "readSequenceFormula"
    );



    return document.getElementById(
        "sequenceFormula"
    ).value;

}



function readPointCount() {

    log(
        "readPointCount"
    );



    return Number(

        document.getElementById(
            "pointCount"
        ).value

    );

}



function readInitialValues(order) {

    log(
        "readInitialValues"
    );



    let values = [];



    for (
        let i = 0;
        i < order;
        i++
    ) {

        values.push(

            Number(

                document.getElementById(
                    `initial${i}`
                ).value

            )

        );

    }



    return values;

}



// =====================
// 분석 함수
// =====================

function analyzeVariables(formula) {

    log(
        "analyzeVariables"
    );



    let found =
        formula.match(/[a-zA-Z]+/g);



    let reserved = [

        "sin",
        "cos",
        "tan",
        "sqrt",
        "log",
        "abs",
        "pow"

    ];



    let result = [];



    if (found) {

        for (let v of found) {

            if (

                !reserved.includes(v)
                &&
                !result.includes(v)

            ) {

                result.push(v);

            }

        }

    }



    return result;

}



function analyzeSequenceVariables(formula) {

    log(
        "analyzeSequenceVariables"
    );



    // =====================
    // 점화식 참조 제거
    // =====================

    let cleaned =
        formula;



    // N(n-1) → ""
    cleaned =
        cleaned.replace(

            /[a-zA-Z]+\(n-[0-9]+\)/g,

            ""

        );



    // N(n-x)
    // N(n-x-1)
    //
    // 내부 변수는 남김

    cleaned =
        cleaned.replace(

            /[a-zA-Z]+\(n-/g,

            ""

        );



    cleaned =
        cleaned.replace(

            /\)/g,

            ""

        );



    return analyzeVariables(
        cleaned
    );

}



function extractSequenceName(formula) {

    log(
        "extractSequenceName"
    );



    let match =

        formula.match(
            /([a-zA-Z]+)\(n/
        );



    if (match) {

        return match[1];

    }



    return "";

}



function analyzeSequenceOrder(formula) {

    log(
        "analyzeSequenceOrder"
    );



    let matches =

        formula.match(
            /[a-zA-Z]+\(n-(\d+)\)/g
        );



    if (!matches) {

        return 1;

    }



    let maxOrder = 1;



    for (let m of matches) {

        let number =

            Number(

                m.match(/\d+/)[0]

            );



        if (number > maxOrder) {

            maxOrder = number;

        }

    }



    return maxOrder;

}



// =====================
// 상태 변경 함수
// =====================

function setXVariable(variable) {

    log(
        "setXVariable"
    );



    xVariable = variable;

}



// =====================
// 계산 함수
// =====================

function calculateFunctionPoints(formula) {

    log(
        "calculateFunctionPoints"
    );



    let points = [];



    let pointCount =
        readPointCount();



    let step =
        20 / pointCount;



    for (
        let x = -10;
        x <= 10;
        x += step
    ) {

        let scope = {};



        for (let v of variables) {

            scope[v] =
                sliderValues[v];

        }



        scope[xVariable] = x;



        let y =
            math.evaluate(
                formula,
                scope
            );



        points.push({

            x: x,

            y: y

        });

    }



    return points;

}



function calculateSequenceValues(
    formula,
    initialValues
) {

    log(
        "calculateSequenceValues"
    );



    let values = [
        ...initialValues
    ];



    let pointCount =
        readPointCount();



    let order =
        initialValues.length;



    for (
        let n = order;
        n < pointCount;
        n++
    ) {

        let expression =
            formula;



        expression =
            expression.replace(

                /[a-zA-Z]+\(n-(.*?)\)/g,

                function (match, expr) {


                    // =====================
                    // offset 계산
                    // =====================
                    //
                    // 예:
                    //
                    // "1"
                    // "(x+1)"
                    //

                    let offset =
                        math.evaluate(

                            expr,

                            sliderValues

                        );



                    offset =
                        Math.floor(
                            offset
                        );



                    // =====================
                    // 실제 index 계산
                    // =====================

                    let index =
                        n - offset;



                    // =====================
                    // 범위 밖이면 0
                    // =====================

                    if (
                        index < 0
                    ) {

                        return 0;

                    }



                    let value =
                        values[index];



                    if (
                        value === undefined
                    ) {

                        return 0;

                    }



                    return value;

                }

            );


        let scope = {};



        for (let v of variables) {

            scope[v] =
                sliderValues[v];

        }



        let next =
            math.evaluate(
                expression,
                scope
            );



        values.push(next);

    }



    return values;

}



function sequenceToPoints(values) {

    log(
        "sequenceToPoints"
    );



    let points = [];



    for (
        let i = 0;
        i < values.length;
        i++
    ) {

        points.push({

            x: i,

            y: values[i]

        });

    }



    return points;

}



// =====================
// 그래프 출력 함수
// =====================

function renderSingleGraph(

    points,
    color = "#4FC3F7"

) {

    log(
        "renderSingleGraph"
    );



    console.log(color);



    // =====================
    // canvas 준비
    // =====================

    let canvas =

        document.getElementById(

            "myChart"

        );



    let ctx =

        canvas.getContext("2d");



    // =====================
    // 데이터 없으면 종료
    // =====================

    if (

        points.length == 0

    ) {

        return;

    }



    // =====================
    // 좌표 범위 계산
    // =====================

    let xs =
        points.map(
            p => p.x
        );



    let ys =
        points.map(
            p => p.y
        );



    let minX =
        Math.min(...xs);

    let maxX =
        Math.max(...xs);

    let minY =
        Math.min(...ys);

    let maxY =
        Math.max(...ys);



    // 0 나누기 방지
    if (minX == maxX) {

        maxX += 1;

    }

    if (minY == maxY) {

        maxY += 1;

    }



    // =====================
    // 여백
    // =====================

    let padding = 40;



    // =====================
    // 그래프 시작
    // =====================

    ctx.beginPath();



    ctx.strokeStyle =
        color;



    ctx.lineWidth = 2;



    // =====================
    // 점 반복
    // =====================

    for (

        let i = 0;

        i < points.length;

        i++

    ) {

        let p =
            points[i];



        // canvas 좌표 변환
        let x =

            padding +

            (

                (p.x - minX)

                /

                (maxX - minX)

            )

            *

            (

                canvas.width
                - padding * 2

            );



        let y =

            canvas.height

            -

            padding

            -

            (

                (p.y - minY)

                /

                (maxY - minY)

            )

            *

            (

                canvas.height
                - padding * 2

            );



        // 첫 점
        if (i == 0) {

            ctx.moveTo(x, y);

        }



        // 이후 점
        else {

            ctx.lineTo(x, y);

        }

    }



    // =====================
    // 실제 출력
    // =====================

    ctx.stroke();

}



// =====================
// UI 생성 함수
// =====================

function createSetupPanel() {

    log(
        "createSetupPanel"
    );



    let html = `

    <div id="setupPanel">

        <h2>그래프 생성</h2>



        <select id="modeSelect">

            <option value="function">

                함수

            </option>



            <option value="sequence">

                점화식

            </option>

        </select>



        <br><br>



        <div id="modeUI"></div>

        <div id="setupInputs"></div>

    </div>

    `;



    document.getElementById(
        "setupContainer"
    ).innerHTML = html;

}



function createFunctionUI() {

    log(
        "createFunctionUI"
    );



    let html = `

    <input
        id="formula"
        value="x^2"
    >



    <br><br>



    <button id="createGraphButton">

        생성

    </button>

    `;



    document.getElementById(
        "modeUI"
    ).innerHTML = html;

}



function createSequenceUI() {

    log(
        "createSequenceUI"
    );



    let formula =
        "a(n-1)+a(n-2)";



    let order =
        analyzeSequenceOrder(
            formula
        );



    let html = `

    <label>

        점화식

    </label>

    <br>



    <input
        id="sequenceFormula"
        value="${formula}"
    >



    <br><br>



    <div id="initialValueInputs">

    `;



    for (
        let i = 0;
        i < order;
        i++
    ) {

        html += `

        <label id="initial${i}Label">

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



    html += `

    </div>



    <button id="createGraphButton">

        생성

    </button>

    `;



    document.getElementById(
        "modeUI"
    ).innerHTML = html;

}



function createVariableSelector(variableList) {

    log(
        "createVariableSelector"
    );



    let html = "";



    for (let v of variableList) {

        html += `

        <label>

            <input
                type="radio"
                name="xvar"
                value="${v}"
            >

            ${v}

        </label>

        <br>

        `;

    }



    document.getElementById(
        "variableSelect"
    ).innerHTML = html;

}



function createSliders(
    variableList,
    useXVariable = true
) {

    log(
        "createSliders"
    );



    let html = "";



    for (let v of variableList) {

        if (
            !useXVariable
            ||
            v != xVariable
        ) {

            if (
                sliderValues[v]
                == undefined
            ) {

                sliderValues[v] = 1;

            }



            html += `

            <label>

                ${v}

            </label>



            <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value="${sliderValues[v]}"
                id="slider_${v}"
            >



            <input
                type="number"
                value="${sliderValues[v]}"
                id="number_${v}"
            >



            <br><br>

            `;

        }

    }



    document.getElementById(
        "sliders"
    ).innerHTML = html;

}



// =====================
// slider 제어 함수
// =====================

function updateSliderValue(variable) {

    log(
        "updateSliderValue"
    );



    let value =
        Number(

            document.getElementById(
                `slider_${variable}`
            ).value

        );



    sliderValues[variable] =
        value;

}



function updateNumberValue(variable) {

    log(
        "updateNumberValue"
    );



    let value =
        Number(

            document.getElementById(
                `number_${variable}`
            ).value

        );



    sliderValues[variable] =
        value;

}



// =====================
// setup 보조 함수
// =====================

function createPointCountInput() {

    log(
        "createPointCountInput"
    );



    document.getElementById(

        "setupInputs"

    ).innerHTML += `

        <div>

            점 개수

            <input
                id="pointCount"
                type="number"
                value="100"
                min="10"
                max="5000"
            >

        </div>

    `;

}



function clearSetupInputs() {

    log(
        "clearSetupInputs"
    );



    document.getElementById(

        "setupInputs"

    ).innerHTML = "";

}


// =====================
// setup 초기화 함수
// =====================

function initializeSetupPanel() {

    log(
        "initializeSetupPanel"
    );



    // setup panel 생성
    createSetupPanel();



    // mode 변경 이벤트 연결
    document.getElementById(

        "modeSelect"

    ).onchange = function () {



        // 현재 모드 읽기
        graphMode =
            readGraphMode();



        // 기존 입력 제거
        clearSetupInputs();



        // 함수 UI
        if (graphMode == "function") {

            createFunctionUI();

            createPointCountInput();

        }



        // 점화식 UI
        if (graphMode == "sequence") {

            createSequenceUI();

            createPointCountInput();

        }

    };

}



// =====================
// 현재 작업 정보 읽기 함수
// =====================

function createCurrentItem() {

    log(
        "createCurrentItem"
    );



    // =====================
    // 공통 정보
    // =====================

    let item = {

        mode:
            graphMode,

        pointCount:
            readPointCount(),

        xVariable:
            xVariable,

        sliderValues:
            structuredClone(
                sliderValues
            )

    };



    // =====================
    // 함수 모드
    // =====================

    if (
        graphMode == "function"
    ) {

        item.formula =

            readFunctionFormula();

    }



    // =====================
    // 점화식 모드
    // =====================

    if (
        graphMode == "sequence"
    ) {

        item.formula =

            readSequenceFormula();



        // -----------------
        // 차수 분석
        // -----------------

        let order =

            analyzeSequenceOrder(
                item.formula
            );



        // -----------------
        // 초기값 저장
        // -----------------

        item.initialValues =

            readInitialValues(
                order
            );

    }

    console.log(item);



    return item;

}


// =====================
// 목록 추가 함수
// =====================

function addItem(item) {

    log(
        "addItem"
    );



    // functionList 배열에 추가
    //
    // Python:
    // functionList.append(item)
    //
    // C 느낌:
    // 배열 뒤에 새 데이터 추가

    functionList.push(
        item
    );

}




// =====================
// 함수 목록 출력 함수
// =====================

function renderFunctionList() {

    log(
        "renderFunctionList"
    );



    // -----------------
    // HTML 문자열 생성용 변수
    // -----------------

    let html = "";



    // -----------------
    // functionList 반복
    // -----------------

    // Python 느낌:
    //
    // for i in range(len(functionList))
    //
    // i는 index(번호)

    for (

        let i = 0;

        i < functionList.length;

        i++

    ) {


        // 현재 item 읽기
        //
        // 예:
        //
        // {
        //     mode : "function",
        //     formula : "x^2"
        // }

        let item =
            functionList[i];



        // -----------------
        // HTML 추가
        // -----------------

        html += `

<div
    class="functionItem"
>

    <!-- -----------------
         함수 선택 영역
         ----------------- -->

    <span

        class="functionSelect"

        data-index="${i}"

    >

        ${item.mode}
        :

        <span
    id="formula_${i}"
></span>

    </span>



    <!-- -----------------
         삭제 버튼
         ----------------- -->

    <button

        class="functionRemove"

        data-index="${i}"

    >

        삭제

    </button>

</div>

<hr>

`;

    }



    // -----------------
    // 실제 HTML 적용
    // -----------------

    document.getElementById(

        "functionListPanel"

    ).innerHTML = html;


    document.getElementById(

        "functionListPanel"

    ).innerHTML = html;



    // =====================
    // KaTeX 렌더링
    // =====================

    for (

        let i = 0;

        i < functionList.length;

        i++

    ) {

        let item =
            functionList[i];



        let target =

            document.getElementById(

                `formula_${i}`

            );



        katex.render(

            item.formula,

            target,

            {

                throwOnError: false

            }

        );

    }

}


// =====================
// 목록 삭제 함수
// =====================

function removeItem(index) {

    log(
        "removeItem"
    );



    // -----------------
    // 배열에서 제거
    // -----------------

    // JS splice:
    //
    // splice(
    //     시작 위치,
    //     삭제 개수
    // )

    functionList.splice(

        index,

        1

    );

}


// =====================
// 목록 item 읽기 함수
// =====================

function readItem(index) {

    log(
        "readItem"
    );



    return functionList[index];

}


function createGraph() {

    console.log(

        "before",

        graphCollection.length

    );

    log(
        "createGraph"
    );



    // =====================
    // 함수 그래프 모드
    // =====================

    if (
        graphMode
        == "function"
    ) {

        // -----------------
        // 함수식 읽기
        // -----------------

        let formula =
            readFunctionFormula();



        // -----------------
        // 변수 분석
        // -----------------

        variables =
            analyzeVariables(
                formula
            );



        // =====================
        // 변수 1개
        // =====================

        if (
            variables.length
            == 1
        ) {

            // 자동 x축 지정
            setXVariable(
                variables[0]
            );



            // 슬라이더 생성
            createSliders(
                variables
            );



            // 좌표 계산
            let points =
                calculateFunctionPoints(
                    formula
                );



            // 그래프 출력
            graphCollection.push(points);

            console.log(

                "before",

                graphCollection.length

            );

            renderAllGraphs();

            console.log(

                graphCollection.length

            );



            // 슬라이더 연결
            connectFunctionSliders(
                formula
            );



            // 설정창 숨기기
            document.getElementById(

                "setupContainer"

            ).style.display = "none";



            return;

        }



        // =====================
        // 변수 여러 개
        // =====================

        createVariableSelector(
            variables
        );



        let radios =

            document.getElementsByName(
                "xvar"
            );



        // radio 선택 이벤트
        for (let radio of radios) {

            radio.onchange =
                function () {



                    // x축 변수 저장
                    setXVariable(
                        radio.value
                    );



                    // 슬라이더 생성
                    createSliders(
                        variables
                    );



                    // 좌표 계산
                    let points =
                        calculateFunctionPoints(
                            formula
                        );



                    // 그래프 출력
                    graphCollection.push(points);

                    renderAllGraphs();

                    console.log(

                        graphCollection.length

                    );



                    // 슬라이더 연결
                    connectFunctionSliders(
                        formula
                    );



                    // 설정창 숨기기
                    document.getElementById(

                        "setupContainer"

                    ).style.display = "none";

                };

        }



        // 아직 x축 선택 안 했으므로 종료
        return;

    }



    // =====================
    // 점화식 모드
    // =====================

    if (
        graphMode
        == "sequence"
    ) {

        // 함수 모드 x축 제거
        xVariable = null;



        // -----------------
        // 점화식 읽기
        // -----------------

        let formula =
            readSequenceFormula();



        // -----------------
        // 변수 분석
        // -----------------

        variables =
            analyzeSequenceVariables(
                formula
            );



        // -----------------
        // 차수 분석
        // -----------------

        let order =
            analyzeSequenceOrder(
                formula
            );



        // -----------------
        // 초기값 읽기
        // -----------------

        let initialValues =
            readInitialValues(
                order
            );



        // -----------------
        // 슬라이더 생성
        // -----------------

        createSliders(
            variables,
            false
        );



        // -----------------
        // 수열 계산
        // -----------------

        let values =
            calculateSequenceValues(

                formula,
                initialValues

            );



        // -----------------
        // 점 변환
        // -----------------

        let points =
            sequenceToPoints(
                values
            );



        // -----------------
        // 그래프 출력
        // -----------------

        graphCollection.push(points);

        renderAllGraphs();

        console.log(

            graphCollection.length

        );



        // -----------------
        // 슬라이더 연결
        // -----------------

        connectSequenceSliders(

            formula,
            initialValues

        );



        // -----------------
        // 설정창 숨기기
        // -----------------

        document.getElementById(

            "setupContainer"

        ).style.display = "none";

    }

}



function connectFunctionSliders(
    formula
) {

    log(
        "connectFunctionSliders"
    );



    for (let v of variables) {

        if (v != xVariable) {

            let slider =
                document.getElementById(
                    `slider_${v}`
                );



            let number =
                document.getElementById(
                    `number_${v}`
                );



            if (!slider || !number) {

                continue;

            }



            slider.oninput =
                function () {


                    updateSliderValue(
                        v
                    );



                    number.value =
                        sliderValues[v];



                    let points =
                        calculateFunctionPoints(
                            formula
                        );



                    renderAllGraphs()

                };



            number.oninput =
                function () {


                    updateNumberValue(
                        v
                    );



                    slider.value =
                        sliderValues[v];



                    let points =
                        calculateFunctionPoints(
                            formula
                        );



                    renderAllGraphs()

                };

        }

    }

}


function connectSequenceSliders(

    formula,

    initialValues

) {

    log(
        "connectSequenceSliders"
    );



    for (let v of variables) {

        // -----------------
        // slider
        // -----------------

        let slider =

            document.getElementById(

                `slider_${v}`

            );



        let number =

            document.getElementById(

                `number_${v}`

            );



        // 없으면 스킵
        if (!slider || !number) {

            continue;

        }



        // =====================
        // slider 입력
        // =====================

        slider.oninput = function () {


            updateSliderValue(
                v
            );



            number.value =

                sliderValues[v];



            let values =
                calculateSequenceValues(

                    formula,

                    initialValues

                );



            let points =
                sequenceToPoints(
                    values
                );



            renderAllGraphs()

        };



        // =====================
        // number 입력
        // =====================

        number.oninput = function () {


            updateNumberValue(
                v
            );



            slider.value =

                sliderValues[v];



            let values =
                calculateSequenceValues(

                    formula,

                    initialValues

                );



            let points =
                sequenceToPoints(
                    values
                );



            renderAllGraphs()

        };

    }

}


function renderAllGraphs() {

    log(
        "renderAllGraphs"
    );



    let canvas =

        document.getElementById(

            "myChart"

        );



    let ctx =

        canvas.getContext("2d");



    // =====================
    // 화면 초기화
    // =====================

    ctx.clearRect(

        0,
        0,
        canvas.width,
        canvas.height

    );



    // =====================
    // 색 목록
    // =====================

    let colors = [

        "#4FC3F7",
        "#FF7043",
        "#66BB6A",
        "#BA68C8",
        "#FFD54F"

    ];



    // =====================
    // 그래프 반복 출력
    // =====================

    for (

        let i = 0;

        i < graphCollection.length;

        i++

    ) {

        renderSingleGraph(

            graphCollection[i],

            colors[
            i % colors.length
            ]

        );

    }

}


function re(points) {

    renderSingleGraph(points);

}