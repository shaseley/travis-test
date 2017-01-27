import unittest

def add_it_up(x):
    total = 0
    for i in x:
        total += i
    return total

class TestAdding(unittest.TestCase):
    def test_add(self):
        nums = [i for i in xrange(1, 100)]
        total = add_it_up(nums)
        self.assertTrue(total, len(nums)*(len(nums)-1)/2)
