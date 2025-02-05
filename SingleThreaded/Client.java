import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class Client {
    public void run() throws IOException{
        int port=8090;
        InetAddress address=InetAddress.getByName("localhost");
        Socket socket=new Socket(address,port);
        PrintWriter toSocketData=new PrintWriter(socket.getOutputStream());
        BufferedReader fromSocketData=new BufferedReader(new InputStreamReader(socket.getInputStream())) ;
    }
    public static void main(String[] args) {
    
    }
    
}
