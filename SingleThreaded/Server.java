import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class Server {
    public void run() throws IOException {
        int port = 8090; // Matching the client port
        ServerSocket serverSocket = new ServerSocket(port);
        System.out.println("Server is listening on port " + port);

        while (true) {
            try {
                Socket acceptConnection = serverSocket.accept(); // Accepts incoming clients
                System.out.println("Client connected: " + acceptConnection.getInetAddress());

                // Create Input and Output Streams
                BufferedReader dataFromClient = new BufferedReader(new InputStreamReader(acceptConnection.getInputStream()));
                PrintWriter dataToClient = new PrintWriter(acceptConnection.getOutputStream(), true);

                // Read message from client
                String message = dataFromClient.readLine();
                System.out.println("Received from client: " + message);

                // Send response to client
                dataToClient.println("Hello, Client! Your message was received.");

                // Close resources
                dataFromClient.close();
                dataToClient.close();
                acceptConnection.close();
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        Server server = new Server();
        try {
            server.run();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
