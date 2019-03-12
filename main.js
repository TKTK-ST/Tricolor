let canv,ctx,info;
const Cell_Size = 90;
const Msg_Box_Size = 80;
const Cell_Num = 8;
const Line_Width = 4;
const fps = 10;
let mouse = new Point();
let Cell = [],Board = [];
const Blue = 1, Red = 2, Empty = 0;
let now_color;



function Point(){
	this.x = 0;
	this.y = 0;
}

function End_Flag(){
	for(let i=0;i<Cell_Num;i++){
		for(let j=0;j<Cell_Num;j++){
			if (Cell[i][j].Can_Put(now_color,false) || Cell[i][j].Can_Put(-now_color,false)){
				return false;
			}
		}
    }
    return true;
}

function Count_Color(color){
    let num = 0;

    for(let i =0; i < Cell_Num; i++){
		for(let j = 0; j < Cell_Num; j++){
			if (Board[i][j] === color){
				num++;
			}
		}
    }
    return num;
}

function Draw_All(){
    // screenクリア
	ctx.clearRect(0, 0, canv.width, canv.height);
    Draw_Line();        
    for(let i=0; i<Cell_Num; i++){
		for(let j=0;j<Cell_Num;j++){
			if (Board[i][j] != Empty && Board[i][j] <= 2){
				Cell[i][j].Draw_Piece(Board[i][j]);
			}
		}
    }
    //setTimeout(arguments.callee,fps);
}

function Draw_Line(num){
    for(let i = 1; i < Cell_Num; i++){
        ctx.beginPath();
        ctx.lineWidth = Line_Width;
        ctx.moveTo(Cell_Size*i,0)
        ctx.lineTo(Cell_Size*i,canv.height);
        ctx.stroke();
    }
    for(let i = 1; i < Cell_Num; i++){
        ctx.beginPath();
        ctx.lineWidth = Line_Width;
        ctx.moveTo(0,Cell_Size*i)
        ctx.lineTo(canv.height,Cell_Size*i);
        ctx.stroke();
    }
}

function Click(event){
	Mouse_Move(event);
	let row,collum;
	for(let i = 1; i <= Cell_Num; i++){
		if(Cell_Size*(i-1) <= mouse.x && Cell_Size*i >mouse.x){
			row = i - 1;
			break;
		}
	}
	for(let i = 1; i <= Cell_Num; i++){
		if(Cell_Size*(i-1) <= mouse.y && Cell_Size*i >mouse.y){
			collum = i - 1;
			break;
		}
	}
	if(row >= 0 && row < Cell_Num && collum >= 0 && collum < Cell_Num){
        if (!Cell[row][collum].Can_Put(now_color)){
			now_color = Math.abs(now_color);	
			return;
		}
	}
	Draw_All();
    //info.innerHTML = mouse.x + ' : ' + mouse.y + '<br />' + row + ' : ' + collum;
    if (!End_Flag()){
    	if(Math.abs(now_color) === Red){
        	now_color = Blue;
        	info.innerHTML = '<font color="blue">青</font>のターン';
    	}else{
        	now_color = Red;
        	info.innerHTML = '<font color="red">赤</font>のターン';
    	}
    }else{
    	info.innerHTML = '<font color="red">赤：' + Count_Color(Red) + '</font>' + '<font color="blue">　青：' + Count_Color(Blue) + '</font>';
    }
}
function Mouse_Move(event){
    mouse.x = event.clientX - canv.offsetLeft - Line_Width*2;
	mouse.y = event.clientY - canv.offsetTop - Line_Width*2;
    //info.innerHTML = mouse.x + ' : ' + mouse.y;
}

class Box{
    constructor(row,collum){
        this.row = row;
        this.collum = collum;
    }
    Draw_Piece(num){
        let color;
        if (num == Red){
            color = '#f44336'
        }else if(num == Blue){
            color = '#246aff';
        }else{
            color = 'white';
        }
    	ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(Cell_Size*this.row+Cell_Size/2, Cell_Size*this.collum+Cell_Size/2, Cell_Size/2*2/3, 0, 2 * Math.PI, true);
        ctx.fill();
    }
    Can_Put(state,put_flag = true){
        let sum = 0;
        if(Board[this.row][this.collum] != 0){
            return false;
        }
        for(let vec_r = -1; vec_r <= 1;vec_r++){
            for(let vec_c = -1; vec_c <= 1;vec_c++){
                let cant_reverce_r = [],cant_reverce_c = [];
                for(let vec = 0;;vec++){
                    let row = this.row + vec_r * (vec + 1);
                    let collum = this.collum + vec_c * (vec + 1);
                    if (row < 0 || row > Cell_Num - 1 || collum < 0 || collum > Cell_Num - 1 || Board[row][collum] == 0) break;
                    //同じ色があったら
                    if ((state > 0 && Board[row][collum] == state) || (state < 0 && Board[row][collum] < 0)){
                        if(put_flag){
                            for(let i = 0;i < vec;i++){
                                Board[cant_reverce_r[i]][cant_reverce_c[i]] *= -1;
                            }
                        }
                        sum += vec;
                        break;
                    }
                    cant_reverce_r[vec] = row;
                    cant_reverce_c[vec] = collum;
                }
            }
        }
        if (sum > 0){
            if (put_flag) Board[this.row][this.collum] = now_color;
            return true;
        }else{
            return false;
        }
    }
}





window.onload = function(){
    for(let i=0;i<Cell_Num;i++){
    	Board[i] = [];
        Cell[i] = [];
    	for(let j=0;j<Cell_Num;j++){
        	Cell[i][j] = new Box(i,j);
        	Board[i][j] = 0;
    	}
    }
    Board[3][3] = Blue;
    Board[4][3] = Red;
    Board[3][4] = Red;
    Board[4][4] = Blue;
    now_color = 1;
    canv = document.getElementById('canv');
    info = document.getElementById('info');
    canv.addEventListener('mousemove',Mouse_Move,true);
    canv.addEventListener('click',Click,true);
    canv.addEventListener('contextmenu',(function(event){
        now_color *= -1;
        Click(event);
    }),true);
    ctx = canv.getContext('2d');
    canv.width = Cell_Size*Cell_Num
    canv.height = canv.width; 
    Draw_All();
};
