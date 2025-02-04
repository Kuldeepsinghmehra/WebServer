import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {
    public void run() throws IOException
    {
        int port=8010;
        ServerSocket socket=new ServerSocket(port);
        socket.setSoTimeout(10000);
        while (true) {
            try{
                System.out.println("System is listening on port "+port);
                Socket acceptConnection=socket.accept();
                System.out.println("Connection accepted from client"+acceptConnection);
                PrintWriter dataTOClient=new PrintWriter(acceptConnection.getOutputStream());
                BufferedReader dataFromCLient=new BufferedReader(new InputStreamReader(acceptConnection.getInputStream()));
                System.out.println("To client Hello from Server");

            }catch(IOException ex){
    
                ex.printStackTrace();
            }
            
        }
       

    }
    public static void main(String[] args) {
       Server server=new Server();
       try{
        server.run();
       }catch(IOException ex)
       {
        ex.printStackTrace();
       }
       
    }
    
}
