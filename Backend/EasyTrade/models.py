from django.db import models
from users.models import User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discountPercentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    rating = models.FloatField()
    stock = models.IntegerField()
    brand = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    thumbnail = models.ImageField(upload_to='static/products/thumbnails')
    # customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='renter_users', blank=True, null=True)
    # seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='renter_users', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    
    def __str__(self):
        return str(self.title)


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/images/')

    def _str_(self):
        return f"{self.product.title} Image"
    
from django.core.validators import MinLengthValidator, EmailValidator, RegexValidator, MinValueValidator
from decimal import Decimal

# class Order(models.Model):
#     name = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
#     address = models.CharField(max_length=255, validators=[MinLengthValidator(5)])
#     email = models.EmailField(validators=[EmailValidator()])
#     card_number = models.CharField(max_length=16, validators=[
#         MinLengthValidator(16),
#         RegexValidator(regex=r'^\d{16}$', message='Card number must be 16 digits long')
#     ])
#     exp_date = models.CharField(max_length=5, validators=[
#         MinLengthValidator(5),
#         RegexValidator(regex=r'^\d{2}/\d{2}$', message='Expiration date must be in MM/YY format')
#     ])
#     cvv = models.CharField(max_length=3, validators=[
#         MinLengthValidator(3),
#         RegexValidator(regex=r'^\d{3}$', message='CVV must be 3 digits long')
#     ])
#     total_items = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
#     total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))])
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Order #{self.pk} - {self.name}"

from django.db import models


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]
    name = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="customer", null=True, blank=True)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="ordered_product", null=True, blank=True
    )
    quantity = models.PositiveIntegerField()
    totalPrice = models.FloatField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    message = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Order {self.name}"
    

# class Review(models.Model):
#     title = models.CharField(max_length=255)
#     content = models.CharField(max_length=255)
#     rate = models.FloatField()
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_reviews')
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviewed_product')

#     def __str__(self):
#         return self.title

class Review(models.Model):
    name = models.CharField(max_length=255)
    rate = models.FloatField(max_length=255)
    reviews = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Wishlist(models.Model):
    name = models.CharField(max_length=15)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    products = models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return f"Wishlist {self.name}"


from django.db import models
from django.core.validators import MinLengthValidator, EmailValidator, RegexValidator, MinValueValidator
from decimal import Decimal

class PayPal(models.Model):
    name = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
    address = models.CharField(max_length=255, validators=[MinLengthValidator(5)])
    email = models.EmailField(validators=[EmailValidator()])
    card_number = models.CharField(max_length=16, validators=[
        MinLengthValidator(16),
        RegexValidator(regex=r'^\d{16}$', message='Card number must be 16 digits long')
    ])
    exp_date = models.CharField(max_length=5, validators=[
        MinLengthValidator(5),
        RegexValidator(regex=r'^\d{2}/\d{2}$', message='Expiration date must be in MM/YY format')
    ])
    cvv = models.CharField(max_length=3, validators=[
        MinLengthValidator(3),
        RegexValidator(regex=r'^\d{3}$', message='CVV must be 3 digits long')
    ])
    total_items = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.pk} - {self.name}"