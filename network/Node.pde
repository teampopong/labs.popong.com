class Node{
  Vector2D pos;
  Vector2D disp;
  Vector2D[] oldpos;
  float mass;
  float newmass;
  color mycolor;

  Node(float _x, float _y,float _mass){
    pos=new Vector2D(_x,_y);
    disp=new Vector2D();
    mass=_mass;
    oldpos=new Vector2D[8];
    for(int i=0;i<oldpos.length;i++)
      oldpos[i]=pos.clone();
    mycolor=color(20+random(215),20+random(215),20+random(215));
  }

  void incrMass(float nm){
    newmass=mass+nm;
  }

  void update(){
    for(int i=oldpos.length-1;i>0;i--)
      oldpos[i]=oldpos[i-1];
    oldpos[0]=pos.clone();
    pos.addSelf(disp);
    disp.clear();
  }

  void draw(){
    if (mass<newmass)
      mass+=.2;

    // Draw trail
    for(int i=0;i<oldpos.length;i++){
      float perc=(((float)oldpos.length-i)/oldpos.length);
      fill(red(mycolor),green(mycolor),blue(mycolor),perc*240);
      ellipse(oldpos[i].x,oldpos[i].y,2*mass*perc,2*mass*perc);
    }

    // Draw ball
    fill(mycolor);
    ellipse(pos.x,pos.y,mass*2,mass*2);
    fill(240,240,240);
    ellipse(pos.x,pos.y,mass*1.5,mass*1.5);
    fill(mycolor);
    ellipse(pos.x,pos.y,mass,mass);

    // TODO: Name should be appear next to it.
  }

  String toString(){
    return pos+"";
  }
}
