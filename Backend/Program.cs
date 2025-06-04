using System.Security.Cryptography.X509Certificates;
using System.Text;
using Backend;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json;
using static System.Console;



var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
TgBot telegramBot = new TgBot();
int orderId = 0;
StringBuilder orderText = new StringBuilder();

var externalFrontendPath = @"C:\Programming\Projects\DeliveryApp\Frontend";



telegramBot.Start();


app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(externalFrontendPath),//Задаем путь к стилю скрипту и Asset
    RequestPath = ""
});



app.Run(async (context) =>
{

    if (context.Request.Path == "/basket")
    {
        await context.Response.SendFileAsync(@"C:\Programming\Projects\DeliveryApp\Frontend\BasketPage.html");
        return;
    }

    else if (context.Request.Path == "/api/buyProd" && HttpMethods.IsPost(context.Request.Method))
    {
        orderText.Clear();
        orderText.AppendLine("Заказ:");
        var order = await context.Request.ReadFromJsonAsync<Order>();
        foreach (Product product in order.Products)
        {
            orderText.AppendLine($"{product.Name}");
            WriteLine("Получен заказ на сумму: " + product.Name);
            WriteLine("Получен заказ на сумму: " + product.Price);
            WriteLine("Получен заказ на сумму: " + product.Weight);
        }

        WriteLine("Получен заказ на сумму: " + order.total);
        orderText.AppendLine($"Сумма:{order.total.ToString()}");
        orderText.AppendLine($"Адрес доставки:{order.adress}");


        //Преместить в Update

        telegramBot.SendOrders(orderText.ToString(), orderId.ToString());

        var thisOrderId = orderId.ToString();
        orderId++;

        WriteLine($"Tg bot method{orderText.ToString()}");

        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { orderId = thisOrderId });
        return;
    }

    //CheckingOrderStatus
    else if (context.Request.Path == "/api/checkOrderStatus" && HttpMethods.IsGet(context.Request.Method))
    {
        string orderId = context.Request.Query["id"];

        string status = telegramBot.CheckStatus(orderId);
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new { status = status });
    }
    else
    {
        await context.Response.SendFileAsync(@"C:\Programming\Projects\DeliveryApp\Frontend\index.html");
    }


});

app.Run();

public class Product
{
    public string Name { get; set; }
    public int Price { get; set; }
    public int Weight { get; set; }
}

public class Order
{
    public List<Product> Products { get; set; }
    public int total { get; set; }
    public string adress { get; set; }
}


