import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;

public class Client {
    public void run() throws IOException {
        int port = 8090; // Matching the server port
        InetAddress address = InetAddress.getByName("localhost");
        Socket socket = new Socket(address, port);
        System.out.println("Connected to server: " + socket.getRemoteSocketAddress());

        // Create Input and Output Streams
        PrintWriter toSocketData = new PrintWriter(socket.getOutputStream(), true);
        BufferedReader fromSocketData = new BufferedReader(new InputStreamReader(socket.getInputStream()));

        // Send message to the server
        toSocketData.println("Hello from the client at " + socket.getLocalAddress());

        // Read response from server
        String response = fromSocketData.readLine();
        System.out.println("Received from server: " + response);

        // Close resources
        toSocketData.close();
        fromSocketData.close();
        socket.close();
    }

    public static void main(String[] args) {
        Client singleThreadClient = new Client();
        try {
            singleThreadClient.run();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
