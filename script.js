const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const canvas2 = document.getElementById("canvas2")
const ctx2 = canvas2.getContext("2d")

const data = {
    Origin: { x: 400, y: 300 },
    width: canvas.width,
    height: canvas.height,
    GravityConstant: 0.1,   //1
    ElasticModulus: 10    //20
}

const PI2 = Math.PI * 2
const print = (t) => { console.log(t) }

function lineTo(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
}

function drawCircle(x, y, radius) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, PI2)
    ctx.fill()
    ctx.closePath()
}

function distance(pos1, pos2) {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2)
}

function getAngle(x1, y1, x2, y2) {
    var rad = Math.atan2(y2 - y1, x2 - x1);
    return (rad * 180) / Math.PI;
}

function getRadian(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}


class Ball {
    constructor(x, y, mass, radius, hangPos) {
        this.length = Math.sqrt((hangPos.x - x) ** 2 + (hangPos.y - y) ** 2)
        this.pos = { x: x, y: y }
        this.vel = { x: 0, y: 0 }
        this.radius = radius   //물체의 반지름
        this.hangPos = hangPos // 연결된 좌표
        this.mass = mass
    }
    get x() { return this.pos.x }
    get y() { return this.pos.y }
    draw() {
        lineTo(this.x, this.y, this.hangPos.x, this.hangPos.y)
        drawCircle(this.x, this.y, this.radius)
    }
    applyGravity() {
        this.vel.y += data.GravityConstant
    }
    applyForce(F) {
        this.vel.x += F.x / this.mass
        this.vel.y += F.y / this.mass
    }
    move() {
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
        //중력
        this.applyGravity()

        //탄성력
        if (this.length < distance(this.pos, this.hangPos)) {
            const _seta = getRadian(this.pos.x, this.pos.y, this.hangPos.x, this.hangPos.y)
            const _origin = {
                x: -this.length * Math.cos(_seta) + this.hangPos.x,
                y: -this.length * Math.sin(_seta) + this.hangPos.y
            }
            const ElasticForce = {
                x: (_origin.x - this.x) * data.ElasticModulus,
                y: (_origin.y - this.y) * data.ElasticModulus
            }
            this.applyForce(ElasticForce)
        }
    }
}

const renderObj = []
renderObj.push(new Ball(data.Origin.x + 100, data.Origin.y + 100, 10, 5, data.Origin))
renderObj.push(new Ball(renderObj[0].x + 200, renderObj[0].y + 100, 10, 5, renderObj[0].pos))
ctx2.fillStyle='rgba(255,60,25,0.1)'
function render() {
    ctx.clearRect(0, 0, data.width, data.height)

    drawCircle(data.Origin.x, data.Origin.y, 2)
    renderObj[0].draw()
    renderObj[0].move()

    renderObj[1].draw()
    renderObj[1].move()

    ctx2.beginPath()
    ctx2.arc(renderObj[1].x, renderObj[1].y, 1, 0, PI2)
    ctx2.fill()
    ctx2.closePath()

    requestAnimationFrame(render)
}

render()