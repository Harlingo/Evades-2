var interpolationEnabled = (localStorage.getItem("interpolation-enabled") || "true") == "true";

function interpolate(start, end, delta){
	if (interpolationEnabled == false) return end;
	if(Math.abs(start - end) > 400) return end; //likely teleported
	
	let lerpto = delta / (1000 / 30);
	let dx = end - start; //distance between x and renderx
	return start + dx * lerpto; //final value
}

class Imat{
    static lp = [];
    static imat(){
        this.lp = [Math.floor(currentPlayer.x / tileSize), Math.floor(currentPlayer.y / tileSize)];
        return `"x": ${Math.floor(currentPlayer.x / tileSize)},"y": ${Math.floor(currentPlayer.y / tileSize)}`;
    }

    static toMe(){
        this.lp[2] = Math.floor(currentPlayer.x / tileSize);
        this.lp[3] = Math.floor(currentPlayer.y / tileSize);
        return this.print();
    }

    static print(){
        let minx = Math.min(this.lp[0], this.lp[2]);
        let maxx = Math.max(this.lp[0], this.lp[2]);
        
        let miny = Math.min(this.lp[1], this.lp[3]);
        let maxy = Math.max(this.lp[1], this.lp[3]);

        return `"x": ${minx},"y": ${miny},"width": ${maxx-minx+1},"height": ${maxy-miny+1}`;
    }
}