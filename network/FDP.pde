// Settings
int CANVAS_WIDTH = 800;
int CANVAS_HEIGHT = 600;
String CANVAS_MODE = JAVA2D;
int SPEED=5;

// Global variables
ArrayList mNodes;
ArrayList mEdges;
ArrayList[] mAdjList;
int mNumNodes;
int mNumNodesDrawn = 0;
int mTranslateX = 0;
int mTranslateY = 0;
int mDiffX = 0;
int mDiffY = 0;
boolean mMousePressed = false;

// Parameters
float k;
int t;

void setup(){
  // Canvas settings
  size(CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_MODE);
  smooth();
  noStroke();

  // Initialize
  prepare();
}

void prepare(){
  mNodes=new ArrayList();
  mEdges=new ArrayList();

  String[] lines = loadStrings("graph.txt");
  mNumNodes = int(lines[0]);
  k=sqrt(width*height/mNumNodes)*.5;
  mAdjList = new ArrayList[mNumNodes];
  for (int i = 0; i < mNumNodes; i++) {
    mAdjList[i] = new ArrayList();
  }
  for (int i = 1; i < lines.length; i++) {
    String[] pieces = split(lines[i], " ");
	int n1 = int(pieces[0]);
	int n2 = int(pieces[1]);
    mAdjList[n1-1].add(n2-1);
    mAdjList[n2-1].add(n1-1);
  }
}

float fa(float m1, float m2, float z){
  return .0001*pow(k-m1-m2-z,2);
  //return .1*pow(m1*m2,2)/pow(z,2);
}

float fr(float m1, float m2, float z){
  return .5*pow(m1+m2+k,2)/pow(z,2);
  //return 20*(m1*m2)/pow(z,2);
}

void draw(){
  // TODO: After all, every nodes should be inside the canvas.
  if ((t++%SPEED)==0 && mNumNodesDrawn<mNumNodes){
    Node newn = new Node(random(width),random(height),10);
    mNodes.add(newn);
    for (Object item : mAdjList[mNumNodesDrawn]) {
      int idx = item;
      if (idx > mNumNodesDrawn) continue;
      Node m = (Node)mNodes.get(idx);
      mEdges.add(new Arc(newn, m));
    }
    mNumNodesDrawn++;
  }

  background(240);
  translate(mTranslateX, mTranslateY);

  for(Iterator it=mNodes.iterator();it.hasNext();){
    Node u=(Node)it.next();
    for(Iterator it2=mNodes.iterator();it2.hasNext();){
      Node v=(Node)it2.next();
      if (u!=v){
        Vector2D delta=v.pos.sub(u.pos);
        float dist = delta.norm();
        if (dist!=0){
          v.disp.addSelf( delta.versor().mult( fr(v.mass,u.mass,dist) ) );
        }
      }
    }
  }

  for(Iterator it=mEdges.iterator();it.hasNext();){
    Arc e=(Arc)it.next();
    Vector2D delta=e.v.pos.sub(e.u.pos);
    float dist = delta.norm();
    if (dist!=0){
      e.v.disp.subSelf( delta.versor().mult( fa(e.v.mass,e.u.mass,dist) ) );
      e.u.disp.addSelf( delta.versor().mult( fa(e.v.mass,e.u.mass,dist) ) );
    }
  }

  for(Iterator it=mNodes.iterator();it.hasNext();){
    Node u=(Node)it.next();
    u.update();
  }

  // Render arcs.
  for(Iterator it=mEdges.iterator();it.hasNext();){
    Arc a=(Arc)it.next();
    a.draw();
  }

  // Render nodes.
  for(Iterator it=mNodes.iterator();it.hasNext();){
    Node u=(Node)it.next();
    u.draw();
  }
}

void mousePressed() {
  mMousePressed = true;
  mDiffX = mouseX - mTranslateX;
  mDiffY = mouseY - mTranslateY;
}

void mouseDragged() {
  if (mMousePressed) {
    mTranslateX = mouseX - mDiffX;
    mTranslateY = mouseY - mDiffY;
  }
}

void mouseReleased() {
  mMousePressed = false;
}
